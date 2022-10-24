import React, { useEffect, useState } from 'react'
import axios from "axios";
import PropTypes from 'prop-types'
import { useQuery } from 'react-apollo'
import { useCssHandles } from 'vtex.css-handles'
import { Input, Button, Spinner, Dropdown, Checkbox, Alert } from 'vtex.styleguide'
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

const maskPhone = (value) => {
    value = value.replace(/\D/g, '') // Remove tudo o que não é dígito
    value = value.replace(/^(\d{2})(\d)/g, '($1) $2') // Coloca parênteses em volta dos dois primeiros dígitos
    value = value.replace(/(\d)(\d{4})$/, '$1-$2') // Coloca hífen entre o quarto e o quinto dígitos
  
    return value
}

const App = ({
    title,
    videoURL,
    subTitle,
    labelButton,
    step04Title,
    step04Description,
    step04DescriptionHighlight
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
        'b2bRegistration__error__page__svg',
        'b2bRegistration__confirm__date__page',
        'b2bRegistration__confirm__date__page__title',
        'b2bRegistration__confirm__date__page__description',
        'b2bRegistration__confirm__date__page__container',
        'b2bRegistration__confirm__date__page__description__highlight',
        'b2bRegistration__confirm__date__page__response__data',
        'b2bRegistration__confirm__date__page__response__data_container',
        'b2bRegistration__confirm__date__page__response__data__form__group',
        'b2bRegistration__confirm__date__page__response__data__label',
        'b2bRegistration__confirm__date__page__response__data__value',
        'b2bRegistration__confirm__date__page__form',
        'b2bRegistration__confirm__date__page__form__container',
        'b2bRegistration__confirm__date__page__form__contact',
        'b2bRegistration__confirm__date__page__form__contact__container',
        'b2bRegistration__confirm__date__checkbox__text'


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

            { step === 4 && <Step04 step04Title={step04Title}
                step04Description={step04Description}
                step04DescriptionHighlight={step04DescriptionHighlight}
                handles={handles}
                responseData={responseData}/>}
            
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

const Step04 = ( {
    step04Title,
    step04Description,
    step04DescriptionHighlight,
    handles,
    responseData
}) => { 
    const [activitySectorOptions, setActivitySectorOptions] = useState([])
    const [entityTypeOptions, setEntityTypeOptions] = useState([])
    const [taxRegimeOptions, setTaxRegimeOptions] = useState([])
    const [useTypeOptios, setUseTypeOptions] = useState()
    const [cnpj, setCNPJ ] = useState('')
    const [addressFormat, setAddressFormat] = useState('')
    const [activitySector, serActivitySector] = useState('')
    const [entityType, setEntityType] = useState('')
    const [pCredSN, setPCredSN] = useState('')
    const [taxRegime, setTaxRegime] = useState('')
    const [useType, setUseType] = useState('')
    const [usagePurpose, setUsagePurpose] = useState('')
    const [emailState, setEmailState] = useState('')
    const [businessPhone, setBusinessPhone] = useState('')
    const [homePhone, setHomePhone] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [isOfAge, setIsOfAge] = useState(false)
    const [isNewsletterOptIn, setIsNewsletterOptIn] = useState(false)
    const [tradeNameState, setTradeNameState] = useState('')
    const [stateRegistration, setStateRegistration] = useState('')
    const [stateRegistrationIsent, setStateRegistrationIsent] = useState(false)
    const [formInValid, setFormInValid] = useState({
        activitySector: false,
        entityType: false,
        taxRegime: false,
        useType: false,
        emailState: false,
        homePhone: false,
        firstName: false,
        lastName: false,
        isOfAge: false,
        tradeNameState: false,
        stateRegistration: false
    })
    const [loadingRequest, setLoadingRequest] = useState(false)
    const [isAlert, setIsAlert] = useState(false)
    const [alertType, setAlertType] = useState('')
    const [alertMessage, setAlertMessage] = useState('')

    const formatCNPJ = (value) => {
        let a = value.substring(0, 2)
        let b = value.substring(12, 14)
        let c = '.xxx.xx/xxxx-'
        return `${a}${c}${b}`
    }

    const formatAddress = (address) => {
        
        let street = address?.street || ''
        let number = address?.number || ''
        

        return `${street}, ${number}, ********`
    }

    const getSAEntity = () => {
        const fields = 'displayName'
        axios
        .get(`/api/dataentities/SA/search?_fields=${fields}`)
        .then(function a(response) {
            // eslint-disable-next-line @typescript-eslint/no-shadow
            const { status, data } = response
            if (status === 200 && data && data.length > 0) {
                let listFortmat = []
                data.map((item) => {
                    listFortmat.push({value: item.displayName, label: item.displayName})
                })
                setActivitySectorOptions(listFortmat)
            }
      })
      .catch(function b(e) {
        console.error("getSAEntity ::: => ", e)
      })
    }

    const getTEEntity = () => {
        const fields = 'displayName'
        axios
        .get(`/api/dataentities/TE/search?_fields=${fields}`)
        .then(function a(response) {
            // eslint-disable-next-line @typescript-eslint/no-shadow
            const { status, data } = response
            if (status === 200 && data && data.length > 0) {
                let listFortmat = []
                data.map((item) => {
                    listFortmat.push({value: item.displayName, label: item.displayName})
                })
                setEntityTypeOptions(listFortmat)
            }
      })
      .catch(function b(e) {
        console.error("getTEEntity ::: => ", e)
      })
    }

    const getTRTEntity = () => {
        const fields = 'displayName'
        axios
        .get(`/api/dataentities/RT/search?_fields=${fields}`)
        .then(function a(response) {
            // eslint-disable-next-line @typescript-eslint/no-shadow
            const { status, data } = response
            if (status === 200 && data && data.length > 0) {
                let listFortmat = []
                data.map((item) => {
                    listFortmat.push({value: item.displayName, label: item.displayName})
                })
                setTaxRegimeOptions(listFortmat)
            }
      })
      .catch(function b(e) {
        console.error("getTRTEntity ::: => ", e)
      })
    }

    const getTUEntity = () => {
        const fields = 'displayName'
        axios
        .get(`/api/dataentities/TU/search?_fields=${fields}`)
        .then(function a(response) {
            // eslint-disable-next-line @typescript-eslint/no-shadow
            const { status, data } = response
            if (status === 200 && data && data.length > 0) {
                let listFortmat = []
                data.map((item) => {
                    listFortmat.push({value: item.displayName, label: item.displayName})
                })
                setUseTypeOptions(listFortmat)
            }
      })
      .catch(function b(e) {
        console.error("getTUEntity ::: => ", e)
      })
    }


    const { ni, address , tradeName, email, phoneNumbers, companyName } = responseData

    useEffect(() => {
       getSAEntity()
       getTEEntity()
       getTRTEntity()
       getTUEntity()
       setAddressFormat(formatAddress(address))
       setCNPJ(formatCNPJ(ni))
       setEmailState(email || '')
       setBusinessPhone(`${phoneNumbers[0]?.ddd || ''}${phoneNumbers[0]?.number|| ''}`)
       setTradeNameState(tradeName || '')

    },[])

    const resetFormValid = () => {
        const newFormValid ={
            activitySector: false,
            entityType: false,
            taxRegime: false,
            useType: false,
            emailState: false,
            homePhone: false,
            firstName: false,
            lastName: false,
            isOfAge: false,
            tradeNameState: false,
            stateRegistration: false
        }

        setFormInValid({...newFormValid})
    }
    const onChangeInput = (e) => {
        resetFormValid()
        const { name, value } = e
        switch (name) {
            case 'activitySector':
                serActivitySector(value)
                break

            case 'entityType':
                setEntityType(value)
                break

            case 'pCredSN':
                setPCredSN(value.replace(/\D/g, ''))
                break

            case 'taxRegime':
                setTaxRegime(value)
                break
            
            case 'useType':
                setUseType(value)
                break

            case 'usagePurpose':
                setUsagePurpose(value)
                break

            case 'firstName':
                setFirstName(value)
                break

            case 'lastName':
                setLastName(value)
                break
            
            case 'email':
                setEmailState(value)
                break

            case 'homePhone':
                setHomePhone(value.replace(/\D/g, ''))
                break

            case 'isOfAge':
                setIsOfAge(!isOfAge)
                break

            case 'isNewsletterOptIn':
                setIsNewsletterOptIn(!isNewsletterOptIn)
                break
            
            case 'tradeName':
                setTradeNameState(value)
                break

            case 'stateRegistration':
                setStateRegistration(value)
                break

            default:
                console.error('Name não encontrado')
        }
    }

    const formatObjectCL = () => {
        const newCL = {
            isCorporate: true,
            firstName,
            lastName,
            corporateDocument: ni,
            corporateName: companyName,
            tradeName: tradeNameState,
            stateRegistration: stateRegistrationIsent? 'Insento' : stateRegistration,
            businessPhone,
            email: emailState,
            homePhone,
            activitySector,
            entityType,
            pCredSN,
            taxRegime,
            useType,
            usagePurpose,
            isNewsletterOptIn,
            isOfAge
        }

        return newCL
    }

    const formatObjectAD = (userId) => {
        const newAD = {
            postalCode: address?.cep || '',
            addressName: 'Comercial',
            street: address?.street || '',
            neighborhood: address?.district || '',
            city: address?.city || '',
            state:  address?.state || '',
            complement: address?.complement || '',
            number: `${phoneNumbers[0]?.ddd || ''}${phoneNumbers[0]?.number|| ''}`,
            userId: userId
        }

        return newAD
    }
   
    const handleOnClick = () => {
        resetFormValid()
        if(formValid()){
            setLoadingRequest(true)
            postDataCL()
        }
    }

    const formValid = () => {
        
        let newFormInValid = formInValid
        let result = true

        if(activitySector === ''){
            newFormInValid.activitySector = true
            result = false
        }

        if(entityType === ''){
            newFormInValid.entityType = true
            result = false
        }

        if(taxRegime === ''){
            newFormInValid.taxRegime = true
            result = false
        }

        if(useType === ''){
            newFormInValid.useType = true
            result = false
        }

        if(firstName === ''){
            newFormInValid.firstName = true
            result = false
        }

        if(lastName === ''){
            newFormInValid.lastName = true
            result = false
        }

        if(emailState === ''){
            newFormInValid.emailState = true
            result = false
        }

        if(homePhone === ''){
            newFormInValid.homePhone = true
            result = false
        }
        if(!isOfAge){
            newFormInValid.isOfAge = true
            result = false
        }

        if(tradeNameState === ''){
            newFormInValid.tradeNameState = true
            result = false
        }

        if(stateRegistration === '' && !stateRegistrationIsent){
            newFormInValid.stateRegistration = true
            result = false
        }

        setFormInValid({...newFormInValid})
        return result
    }

    // CL
    const postDataCL = () => {
        
        axios
        .post(`/api/dataentities/CL/documents`, formatObjectCL())
        .then(function a(response) {
            
            const { status, data } = response;
            if (status === 201 && data) {
                const userId = data?.DocumentId || ''
                postDataAD(userId)  
            }else {
                setIsAlert(true);
                setAlertType('warning');
                setAlertMessage('Ops. Algo deu errado, tente novamente mais tarde.');
            }
        })
        .catch(function b(error) {
            const { response } = error
            const { data, status } = response
            console.error(response)
            setIsAlert(true);
            setAlertType('error');
            if(status === 400){
                setAlertMessage('O e-mail informado já possui um cadastro.');
            }else{
                setAlertMessage(data?.response?.data?.Message || 'Ocorreu um erro no sistema, tente novamente mais tarde.');
            }
            setLoadingRequest(false);
        })
    }

    // AD
    const postDataAD = (userId) => {
        
        axios
            .post(`/api/dataentities/AD/documents`, formatObjectAD(userId))
            .then(function a(response) {
                const { status, data } = response;
                if (status === 201 && data) {
                    setIsAlert(true);
                    setAlertType('success');
                    setAlertMessage('Suas informações foram enviadas com sucesso.');
                }else {
                    setIsAlert(true);
                    setAlertType(warning);
                    setAlertMessage('Ops. Algo deu errado, tente novamente mais tarde.');
                }
            })
            .catch(function b(error) {
                const { response } = error
                const { data } = response
                console.error(response)
                setIsAlert(true);
                setAlertType('error');
                setAlertMessage(data?.Message || 'Ocorreu um erro no sistema, tente novamente mais tarde.');
            })
            .finally(function() { setLoadingRequest(false)});
    }

    const handleChangeStateRegistrationIsent = () => {
        if (!stateRegistrationIsent) {
            setStateRegistration('')
        }
        setStateRegistrationIsent(!stateRegistrationIsent)
    }

    return(
        <section className={`b2bRegistration__confirm__date__page flex flex-column items-center justify-center ${handles.b2bRegistration__confirm__date__page}`}> 
            <h2 className={`b2bRegistration__confirm__date__page__title ${handles.b2bRegistration__confirm__date__page__title}`}>{step04Title}</h2>
            <p className={`b2bRegistration__confirm__date__page__description ${handles.b2bRegistration__confirm__date__page__description}`}>
                {step04Description} 
                <span className={`b2bRegistration__confirm__date__page__description__highlight ${handles.b2bRegistration__confirm__date__page__description__highlight}}`}>{step04DescriptionHighlight}</span>
            </p>

            <section className={`b2bRegistration__confirm__date__page__container flex w-100 pt7 ${handles.b2bRegistration__confirm__date__page__container}`}>
                <section className={`b2bRegistration__confirm__date__page__response__data flex w-100 ${handles.b2bRegistration__confirm__date__page__response__data}`}>
                    <section className={`b2bRegistration__confirm__date__page__response__data__container flex flex-column w-100 ${handles.b2bRegistration__confirm__date__page__response__data__container}`}>
                        <div className={`b2bRegistration__confirm__date__page__response__data__form__group ${handles.b2bRegistration__confirm__date__page__response__data__form__group}`}>
                            <label className={`b2bRegistration__confirm__date__page__response__data__label ${handles.b2bRegistration__confirm__date__page__response__data__label}`}>CNPJ</label>
                            <p className={`b2bRegistration__confirm__date__page__response__data__value ${handles.b2bRegistration__confirm__date__page__response__data__value}`}>{cnpj}</p>
                        </div>

                        {/* <div className={`b2bRegistration__confirm__date__page__response__data__form__group mt5 ${handles.b2bRegistration__confirm__date__page__response__data__form__group}`}>
                            <label className={`b2bRegistration__confirm__date__page__response__data__label ${handles.b2bRegistration__confirm__date__page__response__data__label}`}>Incrição estadual</label>
                            <p className={`b2bRegistration__confirm__date__page__response__data__value ${handles.b2bRegistration__confirm__date__page__response__data__value}`}>{''}</p>
                        </div> */}

                        <div className={`b2bRegistration__confirm__date__page__response__data__form__group mt5 ${handles.b2bRegistration__confirm__date__page__response__data__form__group}`}>
                            <label className={`b2bRegistration__confirm__date__page__response__data__label ${handles.b2bRegistration__confirm__date__page__response__data__label}`}>Razão Social</label>
                            <p className={`b2bRegistration__confirm__date__page__response__data__value ${handles.b2bRegistration__confirm__date__page__response__data__value}`}>{companyName || ''}</p>
                        </div>

                        <div className={`b2bRegistration__confirm__date__page__response__data__form__group mt5 ${handles.b2bRegistration__confirm__date__page__response__data__form__group}`}>
                            <label className={`b2bRegistration__confirm__date__page__response__data__label ${handles.b2bRegistration__confirm__date__page__response__data__label}`}>Cep</label>
                            <p className={`b2bRegistration__confirm__date__page__response__data__value ${handles.b2bRegistration__confirm__date__page__response__data__value}`}>{address?.cep || ''}</p>
                        </div>

                        <div className={`b2bRegistration__confirm__date__page__response__data__form__group mt5 ${handles.b2bRegistration__confirm__date__page__response__data__form__group}`}>
                            <label className={`b2bRegistration__confirm__date__page__response__data__label ${handles.b2bRegistration__confirm__date__page__response__data__label}`}>Endereço</label>
                            <p className={`b2bRegistration__confirm__date__page__response__data__value ${handles.b2bRegistration__confirm__date__page__response__data__value}`}>{addressFormat}</p>
                        </div>

                        <div className={`b2bRegistration__confirm__date__page__response__data__form__group mt5 ${handles.b2bRegistration__confirm__date__page__response__data__form__group}`}>
                            <label className={`b2bRegistration__confirm__date__page__response__data__label ${handles.b2bRegistration__confirm__date__page__response__data__label}`}address>Bairro</label>
                            <p className={`b2bRegistration__confirm__date__page__response__data__value ${handles.b2bRegistration__confirm__date__page__response__data__value}`}>{address?.district || ''}</p>
                        </div>

                        <div className={`b2bRegistration__confirm__date__page__response__data__form__group flex mt5 ${handles.b2bRegistration__confirm__date__page__response__data__form__group}`}>
                            <div className='pr5'>
                                <label className={`b2bRegistration__confirm__date__page__response__data__label ${handles.b2bRegistration__confirm__date__page__response__data__label}`}>Cidade</label>
                                <p className={`b2bRegistration__confirm__date__page__response__data__value ${handles.b2bRegistration__confirm__date__page__response__data__value}`}>{address?.city || ''}</p>
                            </div>
                            <div>
                                <label className={`b2bRegistration__confirm__date__page__response__data__label ${handles.b2bRegistration__confirm__date__page__response__data__label}`}>Estado</label>
                                <p className={`b2bRegistration__confirm__date__page__response__data__value ${handles.b2bRegistration__confirm__date__page__response__data__value}`}>{address?.state || ''}</p>
                            </div>
                        </div>

                    </section>
                </section>
                
                <section className={`b2bRegistration__confirm__date__page__form flex w-100 ${handles.b2bRegistration__confirm__date__page__form}`}>
                    <section className={`b2bRegistration__confirm__date__page__form__container flex flex-column w-100 ${handles.b2bRegistration__confirm__date__page__form__container}`}>
                        
                        {/* stateRegistration */}
                        <section className='mb6'>
                            <Input id="stateRegistration"
                                name="stateRegistration"
                                value={stateRegistration || ''}
                                type="text"
                                label="Inscrição Estadual"
                                readOnly={loadingRequest}
                                disabled={stateRegistrationIsent}
                                onChange={(e) => onChangeInput(e.target)}
                                errorMessage={formInValid.stateRegistration && 'Campo obrigatório.'}/>

                            <section className="pt3">
                                <Checkbox
                                    checked={stateRegistrationIsent}
                                    id="stateRegistrationIsent"
                                    label="Insento"
                                    name="stateRegistrationFree"
                                    onChange={() => handleChangeStateRegistrationIsent()}
                                    value={stateRegistrationIsent}
                                    disabled={loadingRequest}
                                />
                            </section>
                        </section>
                        
                        {/* activitySector */}
                        <section className="mb6">
                            <Dropdown
                                id="activitySector"
                                name="activitySector"
                                placeholder='Setor de atividade'
                                options={activitySectorOptions}
                                label='Setor de atividade'
                                value={activitySector}
                                onChange={(e) => onChangeInput(e.target)}
                                errorMessage={formInValid.activitySector && 'Campo obrigatório.'}
                                disabled={loadingRequest}/>
                        </section>

                        {/* entityType */}
                        <section className="mb6">
                            <Dropdown
                                id="entityType"
                                name="entityType"
                                placeholder='Tipo de atividade'
                                options={entityTypeOptions}
                                label='Tipo de atividade'
                                value={entityType}
                                onChange={(e) => onChangeInput(e.target)}
                                errorMessage={formInValid.entityType && 'Campo obrigatório.'}
                                disabled={loadingRequest}/>
                        </section>

                        {/* pCredSN */}
                        <section className='mb6'>
                            <Input id="pCredSN"
                                name="pCredSN"
                                type="phone"
                                label='Alíquota de ICMS'
                                value={pCredSN}
                                onChange={(e) => onChangeInput(e.target)}
                                readOnly={loadingRequest}/>
                        </section>

                        {/* taxRegime */}
                        <section className="mb6">
                            <Dropdown
                                id="taxRegime"
                                name="taxRegime"
                                placeholder='Regime de tributação'
                                options={taxRegimeOptions}
                                label='Regime de tributação'
                                value={taxRegime}
                                onChange={(e) => onChangeInput(e.target)}
                                errorMessage={formInValid.taxRegime && 'Campo obrigatório.'}
                                disabled={loadingRequest}/>
                        </section>

                        {/* useType */}
                        <section className="mb6">
                            <Dropdown
                                id="useType"
                                name="useType"
                                placeholder='Tipo de Uso'
                                options={useTypeOptios}
                                label='Tipo de Uso'
                                value={useType}
                                onChange={(e) => onChangeInput(e.target)}
                                errorMessage={formInValid.useType && 'Campo obrigatório.'}
                                disabled={loadingRequest}/>
                        </section>

                        {/* usagePurpose */}
                        <section className='mb6'>
                            <Input id="usagePurpose"
                                name="usagePurpose"
                                type="text"
                                label='Propósito de uso'
                                value={usagePurpose}
                                onChange={(e) => onChangeInput(e.target)}
                                readOnly={loadingRequest}/>
                        </section>
                    </section>
                </section>

                <section className={`b2bRegistration__confirm__date__page__form__contact flex flex-column w-100 ${handles.b2bRegistration__confirm__date__page__form__contact}`}>
                    <section className={`b2bRegistration__confirm__date__page__form__contact__container flex flex-column w-100 ${handles.b2bRegistration__confirm__date__page__form__contact__container}`}>
                        
                        {/* tradeName */}
                        <section className='mb6'>
                            <Input id="tradeName"
                                name="tradeName"
                                type="text"
                                value={tradeNameState || ''}
                                onChange={(e) => onChangeInput(e.target)}
                                placeholder='Nome Fantasia'
                                errorMessage={formInValid.tradeNameState && 'Campo obrigatório.'}
                                readOnly={loadingRequest}/>
                        </section>

                        {/* firstName */}
                        <section className='mb6'>
                            <Input id="firstName"
                                name="firstName"
                                type="text"
                                value={firstName || ''}
                                onChange={(e) => onChangeInput(e.target)}
                                placeholder='Nome do contato'
                                errorMessage={formInValid.firstName && 'Campo obrigatório.'}
                                readOnly={loadingRequest}/>
                        </section>

                        {/* lastName */}
                        <section className='mb6'>
                            <Input id="lastName"
                                name="lastName"
                                type="text"
                                value={lastName || ''}
                                onChange={(e) => onChangeInput(e.target)}
                                placeholder='Sobrenome do contato'
                                errorMessage={formInValid.lastName && 'Campo obrigatório.'}
                                readOnly={loadingRequest}/>
                        </section>

                        {/* email */}
                        <section className='mb6'>
                            <Input id="email"
                                name="email"
                                value={emailState}
                                type="email"
                                onChange={(e) => onChangeInput(e.target)}
                                placeholder='E-mail'
                                errorMessage={formInValid.emailState && 'Campo obrigatório.'}
                                readOnly={loadingRequest}/>
                        </section>

                        {/* homePhone */}
                        <section className='mb6'>
                            <Input id="homePhone"
                                name="homePhone"
                                type="phone"
                                value={maskPhone(homePhone || '')}
                                onChange={(e) => onChangeInput(e.target)}
                                maxLength={15}
                                placeholder='Telefone de Contato'
                                errorMessage={formInValid.homePhone && 'Campo obrigatório.'}
                                readOnly={loadingRequest}/>
                        </section>

                         {/* isOfAge */}
                         <section className='mt8 mb6 flex flex-column'>
                            <div className='flex'>
                                <Checkbox
                                    checked={isOfAge}
                                    id="isOfAge"
                                    name='isOfAge'
                                    onChange={(e) => onChangeInput(e.target)}
                                    value={isOfAge}
                                    disabled={loadingRequest}/>
                                <span className={`b2bRegistration__confirm__date__checkbox__text pl3`}>Confirmo ser maior de 18(dezoito) anos e que todos os dados informados acima são veridicos. Ainda confirmo que li e concordo com os <a href='/'>Termos de uso</a> e com a <a href='/'>Política de Privacidade</a>.</span>
                            </div>
                            {formInValid.isOfAge && <span className='error'>É necessário confirmar as informações acima.</span>}
                         </section>

                         {/* isNewsletterOptIn */}
                         <section className='mb6 flex'>
                            <Checkbox
                                checked={isNewsletterOptIn}
                                id="isNewsletterOptIn"
                                name='isNewsletterOptIn'
                                onChange={(e) => onChangeInput(e.target)}
                                value={isNewsletterOptIn}
                                disabled={loadingRequest}/>
                            <span className={`b2bRegistration__confirm__date__checkbox__text pl3`}>Autorizo o recebimento por e-mail e/ou celular, de conteúdos publicitários e promocionas, além de comunicados em geral vindos da Impermarket B2B e seus representantes.</span>
                         </section>

                         {/* request */}
                         <section className='mb6 mt6'>
                            <Button onClick={() => handleOnClick()}
                                isLoading={loadingRequest}>
                                Enviar para analise
                            </Button>
                         </section>
                    </section>
                    
                    {isAlert && 
                        <Alert type={alertType}>
                            {alertMessage}
                        </Alert>
                    }
                    
                </section>
            </section>

        </section>
    )
}

App.propTypes = {
    title: PropTypes.string,
    videoURL: PropTypes.string,
    subTitle: PropTypes.string,
    labelButton: PropTypes.string,
    step04Title: PropTypes.string,
    step04Description: PropTypes.string,
    step04DescriptionHighlight: PropTypes.string
}

App.defaultProps = {
    title: 'Faça parte do nosso ecosistema',
    videoURL: 'https://www.youtube.com/embed/8Gsox9fDT_s',
    subTitle: 'Criar meu acesso',
    labelButton: 'Iniciar cadastro >',
    step04Title: 'Confirmação de dados de acesso',
    step04Description: 'Para sua segurança na nova plataforma, precisamos que você confirme alguns dados. Ao confirmar os dados, ',
    step04DescriptionHighlight: 'você receberá um e-mail para cadastrar uma nova senha.'
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
        step04Title: {
            title: 'Confirmação título',
            type: 'string',
            default: 'Confirmação de dados de acesso'
        },
        step04Description: {
            title: 'Confirmação descrição',
            type: 'string',
            default: 'Para sua segurança na nova plataforma, precisamos que você confirme alguns dados. Ao confirmar os dados, '
        },
        step04DescriptionHighlight: {
            title: 'Confirmação descrição destaque',
            type: 'string',
            default: 'você receberá um e-mail para cadastrar uma nova senha.'
        },
    }
}

export default App