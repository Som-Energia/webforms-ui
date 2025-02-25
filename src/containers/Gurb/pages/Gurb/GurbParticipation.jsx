import React, {useState} from 'react'
import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'
import { textHeader4, textField } from '../../gurbTheme'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import Select from '../../components/Select'

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
        <Box sx={{ marginTop: '2rem' }}>
            <Typography sx={textHeader4}>{t('GURB_LANGUAGE_FIELD')}</Typography>
            <Select 
                options = {options}
                value = {value}
                handleChange = {setValue}
                style = {textField}
            />
        </Box>
    )
}

export default Contract
