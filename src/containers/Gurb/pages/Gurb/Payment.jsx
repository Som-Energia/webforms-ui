import React from 'react'
import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'
import { textHeader3, textHeader4, textBody1 } from '../../gurbTheme'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import InputField from '../../components/InputField'


const Payment = (props) => {

    const { t } = useTranslation()

    return (
        <>
            <Box mb={2}>
                <Typography sx={textHeader4}>{t('GURB_PAYMENT_REVIEW_TITLE_CUSTOMER_COST')}</Typography>
                <Typography sx={textBody1}>{t('GURB_PAYMENT_REVIEW_TEXT_CUSTOMER_COST')}</Typography>
                <InputField
                    name='customer_cost'
                    value={100}
                    readonlyField={true}
                />
            </Box>
            <Box mb={2}>
                <Typography sx={textHeader4}>{t('GURB_PAYMENT_REVIEW_TITLE_GURB_COST')}</Typography>
                <Typography sx={textBody1}>{t('GURB_PAYMENT_REVIEW_TEXT_GURB_COST')}</Typography>
                <InputField
                    name='gurb_cost'
                    value={90}
                    readonlyField={true}
                />
            </Box>
            <Box sx={{display:'flex',justifyContent:'center', width:"100%", gap:2}}>
                <Typography sx={textHeader3}>{"Total a pagar"}</Typography>
                <Typography sx={textBody1}>{"190€ (IVA inclós)"}</Typography>
            </Box>
        </>
    )
}

export default Payment
