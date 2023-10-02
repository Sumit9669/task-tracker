
export const MessageConstants = {

    general: {
        entityNotFound: 'Entity not Found',
        invalidRequestParameters: 'Invalid Request Parameters',
        internalServerException: 'Something happened wrong. Please try again after some time',
        notFound: 'not found',
        updated: 'Succesfully updated',
        notUpdated: 'not updated',
        dataFetch: 'Data fetched',
        invalidUserId: 'User id is invalid.',
        invalidBusinessId: 'Business id is invalid.',
        fetched: 'Successfully fetched.',
        saved: 'Successfully saved.',
        somethingWrong: 'Something happened wrong. Please try again after some time',
        modelInvalid: 'Request Model is invalid',
        recordNotFound: 'no record found',
        serviceUnavailable: 'Not able to communicate on given url ',
        headerMissingError: 'Required header not found in request headers',
        missingHeaders: 'Missing keys or invalid keys in headers',
        unAuthorisedToken: 'Authentication Error, make sure you passed Authorization',
        businessNotFound: 'Business not found',
        reconnectOtherLead: 'The Business you are trying to reconnect is different from the previous one. Please try again.',
        leadsNotFound: 'No leads exist',
        statusErrorFound: 'There is an Error in Updating the Business Status',
        databaseError: 'Error in creating Database',
        getDatabaseError: 'Error in fetching database',
    }
};

export default MessageConstants;