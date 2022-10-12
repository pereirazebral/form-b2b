import PropTypes from 'prop-types'
import { useCssHandles } from 'vtex.css-handles'
import Logo from '../../../assets/garbe-logo.png'
import './garbe-app.global.css'

const GarbeApp = ({
    image,
    text
}) => {

    const CSS_HANDLES = [
        'garbeApp',
        'garbeAppImage',
        'garbeAppText'
    ]

    const { handles } = useCssHandles(CSS_HANDLES)
    
    return(
        <div className={`garbe-app flex flex-column justify-center items-center pv5 mv2 ${handles.garbeApp}`}>
           <img className={`garbe-app-image ${handles.garbeAppImage}`} src={image !== '' ? image : Logo} alt='garbe-logo' title='Garbe Logo'/>
           { text !== '' && <p className={`garbe-app-text ${handles.garbeAppText}`}>{text}</p> }
        </div>
    )
}

GarbeApp.propTypes = {
    image: PropTypes.string,
    text: PropTypes.string
}

GarbeApp.defaultProps = {
    image: '',
    text: 'Esse app é um exemplo para você iniciar o seu desenvolvimento.'
}

GarbeApp.schema = {
    title: 'Garbe app',
    type: 'object',
    properties: {
        image: {
            title: 'Imagem',
            type: 'string',
            default: '',
            widget: {
                'ui:widget': 'image-uploader',
            }
        },
        text: {
            title: 'Texto',
            type: 'string',
            default: 'Esse app é um exemplo para você iniciar o seu desenvolvimento.'
        }
    }
}

export default GarbeApp