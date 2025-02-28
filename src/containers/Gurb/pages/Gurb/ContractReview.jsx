import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'
import { textHeader4 } from '../../gurbTheme'
import Box from '@mui/material/Box'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ReviewField from '../../components/review/ReviewField'
import PersonIcon from '@mui/icons-material/Person';
import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import CheckBox from '@mui/material/Checkbox'

const CustomCheckBox = (props) => {
    const { name, onClick, text, checked } = props

    return (
        <Box mt={2}>
            <FormControlLabel
                sx={{ display: 'flex', gap: 2, color: 'black', fontWeight: 700 }}
                control={
                    <CheckBox
                        name={name}
                        onChange={onClick}
                        checked={checked}
                    />
                }
                label={
                    <Typography
                        variant="body1"
                        align="justify"
                        dangerouslySetInnerHTML={text}></Typography>
                }
            />
        </Box>
    )
}



const ContractReview = (props) => {

    const { t } = useTranslation()
    const { values, setFieldValue } = props

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', width: "100%", marginBottom: "30px" }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <DescriptionOutlinedIcon />
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography sx={textHeader4}>{"Participació en KWh"}</Typography>
                        <ReviewField label={"KWh:"} value={values.contract.gurb_power} />
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <PersonIcon />
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography sx={textHeader4}>{"Beta en percentatge"}</Typography>
                        <ReviewField label={"KWh:"} value={"0.5KWh"} />
                    </Box>
                </Box>
            </Box>
            <Divider />

            <CustomCheckBox name="generic_especific_conditons_accepted"
                onClick={() => setFieldValue("generic_especific_conditons_accepted", !values.generic_especific_conditons_accepted)} text={{
                    __html: t('CONTRACT_PRIVACY_POLICY_TERMS', {
                        url: t('CONTRACT_PRIVACY_POLICY_TERMS_URL')
                    })
                }} checked={values.generic_especific_conditons_accepted} />

            <CustomCheckBox name="privacy_policy_accepted"
                onClick={() => setFieldValue("privacy_policy_accepted", !values.privacy_policy_accepted)} text={{
                    __html: t('CONTRACT_PRIVACY_POLICY_TERMS', {
                        url: t('CONTRACT_PRIVACY_POLICY_TERMS_URL')
                    })
                }} checked={values.privacy_policy_accepted} />

            <CustomCheckBox name="tariff_payment_accepted"
                onClick={() => setFieldValue("tariff_payment_accepted", !values.tariff_payment_accepted)}
                text={{ __html: "Con la aceptación de estas condiciones particulares, se obliga al pago de su consumo al precio que resulte de la aplicaciónn de la tarifa contratada." }}
                checked={values.tariff_payment_accepted}
            />
            <CustomCheckBox name="gurb_adhesion_payment_accepted"
                onClick={() => setFieldValue("gurb_adhesion_payment_accepted", !values.gurb_adhesion_payment_accepted)}
                text={{ __html: "Con la contratación del sservicio GURB me obligo al pago del coste de Adhessión único una vez verificada mi plaza en GURB Mataró y de la Cuota GURB que será de aplicaciónn a partir del primer día posterior a la fecha de activación." }}
                checked={values.gurb_adhesion_payment_accepted}
            />

        </>
    )
}

export default ContractReview
