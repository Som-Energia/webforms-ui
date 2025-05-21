import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import StepHeader from '../components/StepHeader'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';


const Title = (props) => {
    const { t } = useTranslation()
    const { title, mode } = props

    const getDefaultText = () => {
        if (mode === 'success') {
            return t('SUCCESS_TEXT')
        }
        else {
            return t('FAILURE_TEXT')
        }
    }
    return (
        <Typography id="page-title" variant="sectionTitle">
            {title ? t(title) : getDefaultText()}
        </Typography>
    )
}


const Result = (props) => {
    const { children, result, description, title, showHeader, subtitle, mode } = props
    const { language } = useParams()
    const { t, i18n } = useTranslation()


    useEffect(() => {
        i18n.changeLanguage(language)
    }, [language, i18n])


    return (
        <>
            {showHeader && <StepHeader title={t('SUCCESS_TITLE')} />}
            <Box sx={{
                pt: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2
            }}>

                {mode === 'success' ? <CheckCircleIcon fontSize="large" sx={{ color: 'primary.extraLight' }} /> : null}
                {mode === 'failure' ? <CancelIcon fontSize="large" sx={{ color: 'primary2.main' }} /> : null}

                <Title title={title} mode={mode} />

                {subtitle ? (
                    <Typography variant="pagesubtitle">
                        {subtitle}
                    </Typography>
                ) : null}

                {description ? (
                    <Typography
                        sx={{
                            fontWeight: '400',
                            fontSize: '1rem',
                            lineHeight: '1.75',
                            textAlign: 'center',
                            color: 'secondary.dark'
                        }}>
                        {description}
                    </Typography>
                ) : null}
                <Box mt={3} mb={1}>
                    {children}
                </Box>
            </Box>
        </>
    )
}

export default Result
