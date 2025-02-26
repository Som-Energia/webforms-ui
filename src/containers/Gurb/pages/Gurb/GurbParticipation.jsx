import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'
import { textHeader4, textField, textHeader5 } from '../../gurbTheme'
import Box from '@mui/material/Box'
import Select from '../../components/Select'
import Alert from '@mui/material/Alert'

const Contract = (props) => {
    const options = [
        {
            id: '90-pastel',
            value: "90value"
        },
        {
            id: '100-pastel',
            value: '100values'
        }
    ]

    const [value, setValue] = useState(options[0])
    const { t } = useTranslation()

    return (
        <Box sx={{ display:'flex', flexDirection:'column', gap: 1 }}>
            <Typography sx={textHeader4}>{t('GURB_PARTICIPATION_KW_INPUT_TEXT')}</Typography>
            <Typography sx={textHeader5}>{t('GURB_PARTICIPATION_KW_INPUT_TEXT_SECONDARY')}</Typography>
            <Select
                options={options}
                value={value}
                handleChange={setValue}
                style={textField}
                helperText={
                    <span
                        dangerouslySetInnerHTML={{
                            __html: t('GURB_HELP_ANNUAL_CONSUMPTION', {
                                url: t('GURB_HELP_ANNUAL_CONSUMPTION_URL')
                            })
                        }}
                    />
                }
            />
            <Alert severity='info'><Typography variant='body2' align='justify' dangerouslySetInnerHTML={{
                __html: t('GURB_PARTICIPATION_TEXT_1')
            }} /> </Alert>
            <Alert severity='info'><Typography variant='body2' align='justify' dangerouslySetInnerHTML={{
                __html: t('GURB_PARTICIPATION_TEXT_2')
            }} /> </Alert>
        </Box>
    )
}

export default Contract
