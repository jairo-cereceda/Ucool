import { Tarjeta } from "../models/models.js";
import stripe from "../services/stripe.js";

//Obtener todas las tarjetas
export const obtenerTarjetas = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res
        .status(403)
        .json({ mensaje: "Usuario no asociado a un establecimiento." });
    }

    const tarjetas = await Tarjeta.find({
      establecimiento_id: req.user.establecimiento_id,
    });

    res.json(tarjetas);
  } catch (error) {
    console.error("Error al obtener tarjeta:", error);
    res
      .status(500)
      .json({ mensaje: "Error al obtener tarjeta", error: error.message });
  }
};

//Obtener una tarjeta
export const getTarjeta = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ mensaje: "ID de tarjeta no válido." });
    }

    if (!req.user || !req.user.establecimiento_id) {
      return res
        .status(403)
        .json({ mensaje: "Usuario no asociado a un establecimiento." });
    }

    const tarjeta = await Tarjeta.findOne({
      _id: id,
      establecimiento_id: req.user.establecimiento_id,
    });

    if (!tarjeta) {
      return res
        .status(404)
        .json({ mensaje: "Tarjeta no encontrada o no tienes acceso a ella." });
    }

    res.json(tarjeta);
  } catch (error) {
    console.error("Error en getTarjeta:", error);
    res
      .status(500)
      .json({ mensaje: "Error al obtener la tarjeta", error: error.message });
  }
};

//Crear una devolucion
export const crearTarjeta = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res
        .status(403)
        .json({ mensaje: "Usuario no asociado a un establecimiento." });
    }

    const { email, payment_method_id, plan_id } = req.body;

    const customer = await stripe.customers.create({
      email,
      payment_method: payment_method_id,
      invoice_settings: {
        default_payment_method: payment_method_id,
      },
    });

    let subscription = null;
    let latestInvoiceId = null;
    let paymentIntentId = null;
    let paymentIntentStatus = null;

    if (plan_id) {
      subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: plan_id }],
        expand: ["latest_invoice"],
        payment_settings: {
          save_default_payment_method: "on_subscription",
          payment_method_options: {
            card: {
              request_three_d_secure: "automatic",
            },
          },
        },
      });

      if (subscription.latest_invoice) {
        latestInvoiceId =
          typeof subscription.latest_invoice === "string"
            ? subscription.latest_invoice
            : subscription.latest_invoice.id;
        if (subscription.latest_invoice.payment_intent) {
          paymentIntentId =
            typeof subscription.latest_invoice.payment_intent === "string"
              ? subscription.latest_invoice.payment_intent
              : subscription.latest_invoice.payment_intent.id;
        }
      }

      if (
        subscription.status === "incomplete" &&
        paymentIntentId &&
        subscription.latest_invoice.payment_intent.status === "requires_action"
      ) {
        return res.status(202).json({
          message: "Subscription requires further action.",
          subscriptionId: subscription.id,
          customerId: customer.id,
          paymentMethodId: payment_method_id,
          clientSecret:
            subscription.latest_invoice.payment_intent.client_secret,
          requiresAction: true,
        });
      }
    }

    const nuevaTarjeta = new Tarjeta({
      stripe_customer_id: customer.id,
      stripe_payment_method_id: payment_method_id,
      subscription_id: subscription?.id || null,
      establecimiento_id: req.user.establecimiento_id,
    });

    const tarjetaGuardada = await nuevaTarjeta.save();
    res.status(201).json(tarjetaGuardada);
  } catch (error) {
    console.error("Error al crear tarjeta:", error);
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ mensaje: "Error de validación", errores: error.errors });
    }
    res.status(500).json({
      mensaje: "Error del servidor al crear tarjeta.",
      error: error.message,
    });
  }
};

//Actualizar una devolucion
export const actualizarTarjeta = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res.status(403).json({ mensaje: "Acción no autorizada." });
    }
    const tarjeta = await Tarjeta.findById(req.params.id);

    if (!tarjeta) {
      return res.status(404).json({ mensaje: "Tarjeta no encontrada." });
    }

    if (
      tarjeta.establecimiento_id.toString() !==
      req.user.establecimiento_id.toString()
    ) {
      return res.status(403).json({
        mensaje: "No tienes permiso para modificar esta tarjeta.",
      });
    }

    const { stripe_payment_method_id, nuevo_plan_id, pausar, reactivar } =
      req.body;

    if (stripe_payment_method_id) {
      await stripe.paymentMethods.attach(stripe_payment_method_id, {
        customer: tarjeta.stripe_customer_id,
      });

      await stripe.customers.update(tarjeta.stripe_customer_id, {
        invoice_settings: {
          default_payment_method: stripe_payment_method_id,
        },
      });

      tarjeta.stripe_payment_method_id = stripe_payment_method_id;
    }

    if (nuevo_plan_id && tarjeta.subscription_id) {
      const subscription = await stripe.subscriptions.retrieve(
        tarjeta.subscription_id
      );

      await stripe.subscriptions.update(tarjeta.subscription_id, {
        cancel_at_period_end: false,
        proration_behavior: "create_prorations",
        items: [
          {
            id: subscription.items.data[0].id,
            price: nuevo_plan_id,
          },
        ],
      });
    }

    if (pausar && tarjeta.subscription_id) {
      await stripe.subscriptions.update(tarjeta.subscription_id, {
        pause_collection: { behavior: "mark_uncollectible" },
      });
    }

    if (reactivar && tarjeta.subscription_id) {
      await stripe.subscriptions.update(tarjeta.subscription_id, {
        pause_collection: "",
      });
    }

    Object.assign(tarjeta, req.body);
    const tarjetaActualizada = await tarjeta.save();

    res.json(tarjetaActualizada);
  } catch (error) {
    console.error("Error al actualizar tarjeta:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        mensaje: "Error de validación al actualizar",
        errores: error.errors,
      });
    }
    res.status(500).json({
      mensaje: "Error al actualizar tarjeta",
      error: error.message,
    });
  }
};

//Eliminar una devolucion
export const eliminarTarjeta = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res.status(403).json({ mensaje: "Acción no autorizada." });
    }

    const tarjeta = await Tarjeta.findById(req.params.id);

    if (!tarjeta) {
      return res.status(404).json({ mensaje: "Tarjeta no encontrada." });
    }

    if (
      tarjeta.establecimiento_id.toString() !==
      req.user.establecimiento_id.toString()
    ) {
      return res.status(403).json({
        mensaje: "No tienes permiso para eliminar este tarjeta.",
      });
    }

    if (tarjeta.subscription_id) {
      await stripe.subscriptions.del(tarjeta.subscription_id);
    }

    tarjeta.activo = false;
    await tarjeta.save();

    res.json({ mensaje: "Suscripción cancelada." });
  } catch (error) {
    console.error("Error al eliminar tarjeta:", error);
    res.status(500).json({
      mensaje: "Error al eliminar tarjeta",
      error: error.message,
    });
  }
};
