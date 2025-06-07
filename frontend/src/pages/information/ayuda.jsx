import React from "react";
import Header from "../../components/header/headerPage";
import Footer from "../../components/footer/footerPage";
import HelpRow from "../../components/information/helpRow";
import { useTranslation } from "react-i18next";

export default function PanelAyuda() {
  const { t } = useTranslation();

  const questions = [
    "howToAddEmployee",
    "givePrivileges",
    "createDiscounts",
    "metricsCalculation",
  ];

  return (
    <div className="help flex flex-col justify-between min-h-screen">
      <Header />
      <div className="help__container">
        <h1 className="help__container__title">Ayuda</h1>
        <div className="help__container__rows">
          {questions.map((key) => (
            <HelpRow
              title={t(`help.faq.${key}.question`)}
              content={t(`help.faq.${key}.answer`)}
            />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
