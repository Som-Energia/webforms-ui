const { t } = require("i18next");

function getCommercialName(tariff) {
    let tariff_mapping = {
            "2.0TD_SOM": t("TAR_20TD_SOM"),
            "2.0TD_SOM_INSULAR": t("TAR_2.0TD_SOM_INSULAR"),
            "3.0TD_SOM": t("TAR_30TD_SOM"), 
            "3.0TD_SOM_INSULAR": t("TAR_30TD_SOM_INSULAR"),
            "6.0TD_SOM":t("TAR_60TD_SOM"),
            "6.0TD_SOM_INSULAR":t("TAR_60TD_SOM_INSULAR"),
            "Indexada 2.0TD Península": t("TAR_INDEXADA_20TD_PENÍNSULA"),
            "Indexada 2.0TD Canàries": t("TAR_INDEXADA_20TD_CANÀRIES"),
            "Indexada 2.0TD Balears": t("TAR_INDEXADA_20TD_BALEARS"), 
            "Indexada 3.0TD Península": t("TAR_INDEXADA_30TD_PENÍNSULA"), 
            "Indexada 3.0TD Canàries": t("TAR_INDEXADA_30TD_CANÀRIES"),
            "Indexada 3.0TD Balears": t("TAR_INDEXADA_30TD_BALEARS"),
            "Indexada 6.1TD Peninsula": t("TAR_INDEXADA_61TD_PENINSULA"),
            "Indexada 6.1TD Canàries": t("TAR_INDEXADA_61TD_CANÀRIES"),
            "Indexada 6.1TD Balears": t("TAR_INDEXADA_61TD_BALEARS"),
            "Indexada Empresa Península": t("TAR_INDEXADA_EMPRESA_PENÍNSULA"),
            "Indexada Empresa Canàries": t("TAR_INDEXADA_EMPRESA_CANÀRIES"),
            "Indexada Empresa Balears": t("TAR_INDEXADA_EMPRESA_BALEARS")
    }
    return tariff_mapping[tariff];
}


export default getCommercialName;