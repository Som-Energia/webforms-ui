import React, { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'

import { makeStyles } from '@material-ui/core/styles'

const GeneralTermsContent = ({ language }) => {
  switch (language) {
    case 'ca':
      const GeneraTermsCa = lazy(() =>
        import('data/HolderChange/GeneraTermsCa')
      )
      return <GeneraTermsCa />
    case 'eu':
      const GeneraTermsEu = lazy(() =>
        import('data/HolderChange/GeneraTermsEu')
      )
      return <GeneraTermsEu />
    case 'gl':
      const GeneraTermsGl = lazy(() =>
        import('data/HolderChange/GeneraTermsGl')
      )
      return <GeneraTermsGl />
    default:
      const GeneraTermsEs = lazy(() =>
        import('data/HolderChange/GeneraTermsEs')
      )
      return <GeneraTermsEs />
  }
}

const GeneralTerms = () => {
  const classes = useStyles()
  const { i18n } = useTranslation()

  return (
    <span className={classes.container}>
      <Suspense>
        <GeneralTermsContent language={i18n.language} />
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

export default GeneralTerms
