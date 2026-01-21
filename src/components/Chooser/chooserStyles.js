import { SECONDARY_LIGHT } from '../../themes/webforms'


export const chooserStyles = {
    paddingTop: '1.5rem',
    paddingBottom: '2rem',
    paddingLeft: '1.625rem',
    paddingRight: '1.625rem',
    borderRadius: '8px',
    border: `1px solid ${SECONDARY_LIGHT}`,
    cursor: 'pointer'
}

export const chooserSelectedStyles = {
    ...chooserStyles,
    backgroundColor: 'secondary.extraLight'
}