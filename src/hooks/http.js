import { useReducer, useCallback } from "react"

const httpReducer = (currentHTTPState, action) => {
    switch (action.type) {
        case 'SEND':
            return { loading: true, error: null, data: null, extra: null, identifier: action.identifier }
        case 'RESPONSE':
            return { ...currentHTTPState, loading: false, data: action.responseData, extra: action.extra }
        case 'ERROR':
            return { loading: false, error: action.errorMessage }
        case 'CLEAR_ERR':
            return { ...currentHTTPState, error: null }
        default:
            throw new Error('Should not be reached!')
    }
}

const useHTTP = () => {

    const [httpState, dispatchHTTP] =
        useReducer(httpReducer, {
            loading: false,
            error: null,
            data: null,
            extra: null,
            identifier: null
        })

    const sendRequest = useCallback((url, method, body, reqExtra, reqIdentifier) => {
        dispatchHTTP({ type: 'SEND', identifier: reqIdentifier })
        fetch(url, {
            method: method,
            body: body,
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {
            return response.json()
        }).then(responseData => {
            dispatchHTTP({ type: 'RESPONSE', responseData: responseData, extra: reqExtra })
        })
            .catch(error => {
                dispatchHTTP({ type: 'ERROR', errorMessage: 'Something went wrong!' })
            })
    }, [])

    return {
        isLoading: httpState.loading,
        data: httpState.data,
        error: httpState.error,
        reqExtra: httpState.extra,
        reqIdentifier: httpState.identifier,
        sendRequest
    }
}

export default useHTTP