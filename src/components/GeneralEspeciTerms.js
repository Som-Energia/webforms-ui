import React, { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'

import { makeStyles } from '@material-ui/core/styles'

const GeneralEspeciTermsContent = ({ language }) => {
  switch (language) {
    case 'ca':
      const GeneraTermsCa = lazy(() =>
        import('data/HolderChange/Indexed/GeneraEspeciTermsCa')
      )
      return <GeneraTermsCa />
    case 'eu':
      const GeneraTermsEu = lazy(() =>
        import('data/HolderChange/Indexed/GeneraEspeciTermsEu')
      )
      return <GeneraTermsEu />
    case 'gl':
      const GeneraTermsGl = lazy(() =>
        import('data/HolderChange/Indexed/GeneraEspeciTermsGl')
      )
      return <GeneraTermsGl />
    default:
      const GeneraTermsEs = lazy(() =>
        import('data/HolderChange/Indexed/GeneraEspeciTermsEs')
      )
      return <GeneraTermsEs />
  }
}

const GeneralEspeciTerms = () => {
  const classes = useStyles()
  const { i18n } = useTranslation()

  return (
    <span className={classes.container}>
      <Suspense>
        <GeneralEspeciTermsContent language={i18n.language} />
      </Suspense>
    </span>
  )
}

const useStyles = makeStyles((theme) => ({
  container: {
    '& a': {
      color: theme.palette.text.secondary
    },
    '& h2': {
      fontSize: '1.25rem'
    },
    '& .pujar a': {
      fontSize: '1rem'
    },
    '& .sagnia': {
      paddingLeft: '1rem'
    }
  }
}))

export default GeneralEspeciTerms