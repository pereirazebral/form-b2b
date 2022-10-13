import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useQuery } from 'react-apollo'
import { useCssHandles } from 'vtex.css-handles'
import { Input, Button, Spinner } from 'vtex.styleguide'
import companyInformationQuery from './companyInformation.gql'
import './app.global.css'

const maskCNPJ = (value) => {
    if (value) {
      value = value.replace(/\D/g, '')
      value = value.replace(/^(\d{2})(\d)/, '$1.$2')
      value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      value = value.replace(/\.(\d{3})(\d)/, '.$1/$2')
      value = value.replace(/(\d{4})(\d)/, '$1-$2')
  
      return value
    }
  
    return ''
}

const App = ({
    title,
    videoURL,
    subTitle,
    labelButton
}) => {

    const CSS_HANDLES = [
        'b2bRegistration',
        'b2bRegistration__title',
        'b2bRegistration__content',
        'b2bRegistration__video',
        'b2bRegistration__form__container',
        'b2bRegistration__sub__title',
        'b2bRegistration__form',
        'b2bRegistration__form__input',
        'b2bRegistration__form__button',
        'b2bRegistration__loading',
        'b2bRegistration__error__page',
        'b2bRegistration__error__page__title',
        'b2bRegistration__error__page__description',
        'b2bRegistration__error__page__svg'
    ]

    const { handles } = useCssHandles(CSS_HANDLES)

    const [cnpjValue, setCnpjValue] = useState('')
    const [step, setStep] = useState(1)
    const [isRequest, setIsRequest] = useState(false)
    const [isFormInValid, setIsFormInValid] = useState(false)
    const [responseData, setResponseData] = useState(null)
    const [alertTitle, setAlertTitle ] = useState('')
    const [alertDescription, setAlertDescription ] = useState('')
    const handleOnChange = (e) => {
        const {target} = e
        const value = target.value.replace(/\D/g, '')
        setCnpjValue(value)
        setIsFormInValid(false)
    }
    
    const handleOnClick = () => {
        if(cnpjValue.length === 14){
            setIsRequest(true)
        }else{
            setIsFormInValid(true)
        }
    }
    
    return(
        <>
            { step === 1 && <Step01 handles={handles}
                title={title}
                videoURL={videoURL}
                subTitle={subTitle}
                labelButton={labelButton}
                handleOnChange={handleOnChange}
                cnpjValue={cnpjValue}
                isRequest={isRequest}
                handleOnClick={handleOnClick}
                isFormInValid={isFormInValid}/> }

            { step === 3 && <Step03 handles={handles}
                alertTitle={alertTitle}
                alertDescription={alertDescription}
                setStep={setStep}/>}


            {isRequest && <Step02 cnpjValue={cnpjValue}
                setIsRequest={setIsRequest}
                setResponseData={setResponseData}
                setStep={setStep}
                setAlertTitle={setAlertTitle}
                setAlertDescription={setAlertDescription}/>}
            
        </>
    )
}

const Step01 = ({
    handles,
    title,
    videoURL,
    subTitle,
    labelButton,
    handleOnChange,
    cnpjValue,
    isRequest,
    handleOnClick,
    isFormInValid
}) => {
    return(
        <section className={`b2b-registration flex flex-column justify-center items-center ${handles.b2bRegistration}`}>
            <h1 className={`b2bRegistration__title ${handles.b2bRegistration__title}`}>{title}</h1>
            <section className={`b2bRegistration__content items-center w-100 ${handles.b2bRegistration__content}`}>
                <section className={`b2bRegistration__form__container flex flex-column justify-center items-center ${handles.b2bRegistration__form__container}`}>
                    <h2 className={`b2bRegistration__sub__title ${handles.b2bRegistration__sub__title}`}>{subTitle}</h2>
                    <form className={`b2bRegistration__form w-100 ${handles.b2bRegistration__form}`}>
                        <div className={`b2bRegistration__form__input pt7 ${handles.b2bRegistration__form__input}`}>
                            <Input 
                                id="cnpj"
                                name="cnpj"
                                type="tel"
                                placeholder="CNPJ" 
                                size="large"
                                maxLength={18}
                                onChange={ (e) => handleOnChange(e)}
                                value={maskCNPJ(cnpjValue)}
                                readOnly={isRequest}
                                errorMessage={isFormInValid && 'Digite um CNPJ válido' || ''}/>
                        </div>
                        <div className={`b2bRegistration__form__button pt3 ${handles.b2bRegistration__form__button}`}>
                            <Button variation="primary"
                                block
                                disabled={isRequest}
                                onClick={ () => handleOnClick()}>
                                {labelButton}
                            </Button>
                        </div>
                        { isRequest && <Loading handles={handles}/>}
                    </form>
                </section>
                <section className={`b2bRegistration__video flex justify-center items-center ${handles.b2bRegistration__video}`}>
                    <iframe width="100%" height="100%" 
                        src={videoURL} 
                        title="YouTube video player" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen/>
                </section>
            </section>
        </section>
    )
}

const Loading = ({
    handles
}) => {
    return(
        <section className={`b2bRegistration__loading flex justify-center items-center w-100 pt7 ${handles.b2bRegistration__loading}`}>
            <Spinner/>
        </section>
    )
}

const Step02 = ({
    cnpjValue,
    setIsRequest,
    setResponseData,
    setStep,
    setAlertTitle,
    setAlertDescription

}) => {

    const { loading, error, data } = useQuery(
        companyInformationQuery, {
            variables: { cnpj: cnpjValue },
            fetchPolicy: 'no-cache'
        }
    )

    if(loading) return <></>

    if(error) {
        setIsRequest(false)
        setStep(3)
        setResponseData(null)
        setAlertTitle('Ops. Aconteceu um erro no sistema.')
        setAlertDescription('Algo deu errado, tente novamente mais tarde.')
    }

    if(data && data?.getCompanyInformation){
        setIsRequest(false)
        setStep(4)
        setResponseData(data.getCompanyInformation)
        setAlertTitle('')
        setAlertDescription('')
    }else{
        setIsRequest(false)
        setStep(3)
        setResponseData(null)
        setAlertTitle('Tivemos um problema no seu cadastro')
        setAlertDescription('Tente novamente mais tarde.')
    }

    return <></>
}

const Step03 = ({
    handles,
    alertTitle,
    alertDescription,
    setStep
}) => {
    return(
        <section className={`b2bRegistration__error__page flex flex-column justify-center items-center w-100 ${handles.b2bRegistration__error__page}`}>
            <svg className={`b2bRegistration__error__page__svg ${handles.b2bRegistration__error__svg}`} data-name="Layer 1" id="Layer_1" viewBox="0 0 52 51.99" xmlns="http://www.w3.org/2000/svg"><path d="M47.89,52H4.11A4.1,4.1,0,0,1,.44,46.05L22.33,2.27a4.1,4.1,0,0,1,7.34,0L51.56,46.05A4.1,4.1,0,0,1,47.89,52ZM26,4a.1.1,0,0,0-.1.06L4,47.84s0,0,0,.1a.09.09,0,0,0,.09.05H47.89a.09.09,0,0,0,.09-.05s0-.08,0-.1L26.1,4.06A.1.1,0,0,0,26,4Z"/><polygon points="28.85 33.55 23.16 33.55 22.84 21.29 29.16 21.29 28.85 33.55"/><rect height="6.32" rx="3" width="6.32" x="22.84" y="36.29"/></svg>
            <h2 className={`b2bRegistration__error__page__title ${handles.b2bRegistration__error__page__title}`}>{alertTitle}</h2>
            <p className={`b2bRegistration__error__page__description ${handles.b2bRegistration__error__page__description}`}>{alertDescription}</p>
            <Button variation="primary" onClick={() => setStep(1)}>Voltar</Button>
        </section>
    )
}


App.propTypes = {
    title: PropTypes.string,
    videoURL: PropTypes.string,
    subTitle: PropTypes.string,
    labelButton: PropTypes.string
}

App.defaultProps = {
    title: 'Faça parte do nosso ecosistema',
    videoURL: 'https://www.youtube.com/embed/8Gsox9fDT_s',
    subTitle: 'Criar meu acesso',
    labelButton: 'Iniciar cadastro >'
}

App.schema = {
    title: 'B2B Registration',
    type: 'object',
    properties: {
        // image: {
        //     title: 'Imagem',
        //     type: 'string',
        //     default: '',
        //     widget: {
        //         'ui:widget': 'image-uploader',
        //     }
        // },
        title: {
            title: 'Título',
            type: 'string',
            default: 'Faça parte do nosso ecosistema'
        },
        videoURL: {
            title: 'Vídeo URL',
            type: 'string',
            default: 'https://www.youtube.com/embed/8Gsox9fDT_s'
        },
        subTitle: {
            title: 'Sub Título',
            type: 'string',
            default: 'Criar meu acesso'
        },
    }
}

export default App