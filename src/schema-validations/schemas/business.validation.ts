const Joi = require('joi').extend(require('@joi/date'));
import { CommonFormat } from 'src/constants/common.constants';
import { StatusType } from 'src/enums/operation-types';
import { SyncIntervals } from 'src/enums/sync-setting-enums';
import { ProviderType } from 'src/enums/common-enums'

const joiDateFormat = Joi.date().format(CommonFormat.date);

// #region add Business
const AddressSchema = Joi.object().keys({
    addressType: Joi.number().allow(1, 2, 3).required(),
    line1: Joi.string().trim().required(),
    line2: Joi.string().allow(null),
    city: Joi.string().trim().required(),
    postalCode: Joi.string().trim().required(),
    state: Joi.string().allow(null),
    country: Joi.string().allow(null)
});

const BusinessSchema = Joi.object().keys({
    businessName: Joi.string().trim().required(),
    legalName: Joi.string().trim().required(),
    country: Joi.string().trim().required(),
    email: Joi.string().email(),
    fiscalYearStartMonth: Joi.string().trim().required(),
    businessStartDate: joiDateFormat.required(),
    website: Joi.string(),
    businessPlateformId: Joi.string().trim().required(),
    homeCurrency: Joi.string().trim().required(),
    provider: Joi.number().allow(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14).required(),
    leadId: Joi.string().trim().required()
});

const TokenSchema = Joi.object().keys({
    accessToken: Joi.string().trim().required(),
    refreshToken: Joi.string().trim().required(),
    refreshTokenExpiresAt: Joi.date().format('YYYY-MM-DDTHH:mm:ss.sssZ').raw().options({ convert: true }).required(),
    accessTokenExpireTime: Joi.date().format('YYYY-MM-DDTHH:mm:ss.sssZ').raw().options({ convert: true }).required(),
    provider: Joi.number().allow(1, 2, 3).required(),
});


const Phone = Joi.object().keys({
    phoneType: Joi.number(),
    status: Joi.number(),
    phoneNumber: Joi.string().allow('').allow(null), // change to null temporarily
    phoneCountryCode: Joi.string().allow('').allow(null)
});

const AddBusinessSchema = Joi.object().keys({
    business: BusinessSchema.required(),
    address: Joi.array().items(AddressSchema).min(1),
    token: TokenSchema.required(),
    phone: Phone.optional().allow(null)
});
// #endregion

//#region business payment
const AddCreditDebitMemoSchema = Joi.object().keys({
    transactionId: Joi.string().trim().required(),
    date: joiDateFormat.required(),
    businessId: Joi.string().uuid(),
    transactionType: Joi.string().trim().required(),
    expectedDate: joiDateFormat.required().allow('', null),
    accountId: Joi.string().allow('', null),
    headId: Joi.number().required(),
    paidAmount: Joi.number().required(),
    lastBankAccountID: Joi.string().allow('', null).required(),
    amount: Joi.number().required(),
    description: Joi.string().allow('', null),
    number: Joi.string().allow('', null),
    dueDate: Joi.string().allow('', null),
    paidDate: joiDateFormat.required(),
    contactId: Joi.string().trim().required(),
    active: Joi.boolean().required(),
    balance: Joi.number().required()
});

// #region business Transactions
const businessTransaction = Joi.object().keys({
    businessId: Joi.string().uuid().trim().required(),
    transactionDate: joiDateFormat.required(),
    transactionId: Joi.string().trim().required(),
    contactId: Joi.string().allow(''),
    transactionType: Joi.string().allow(''),
    accountId: Joi.string().trim().required(),
    paidAmount: Joi.number().required(),
    lastBankAccountID: Joi.string().allow(''),
    dueDate: joiDateFormat.allow(null),
    amount: Joi.number().required(),
    number: Joi.string().allow(null).allow(''),
    headId: Joi.number().required(),
    description: Joi.string(),
    paidDate: joiDateFormat

});

const BusinessTransactionSchema = Joi.object({
    transactions: Joi.array().items(businessTransaction),
});

//#endregion


//#region Business Journal
const journal = Joi.object().keys({
    businessId: Joi.string().uuid().trim().required(),
    journalDate: joiDateFormat.required(),
    transactionId: Joi.string().max(36).required(),
    transactionType: Joi.string().allow(''),
    number: Joi.string().allow(''),
    contactId: Joi.string().trim().required(),
    description: Joi.string().allow(''),
    accountId: Joi.string().required(),
    amount: Joi.number().required(),
    isReconciled: Joi.boolean().required()
});

const BusinessJournalSchema = Joi.object({
    journals: Joi.array().items(journal),
});

//#endregion



//Contact Address validation
const BusinessContactAdressSchema = Joi.object().keys({
    addressType: Joi.number().required(),
    addressLine1: Joi.string().trim().required(),
    addressLine2: Joi.string().allow(null).allow(''),
    status: Joi.number().required(),
    city: Joi.string().allow(null).allow(''),
    postalCode: Joi.string().allow(null).allow(''),
    state: Joi.string().allow(null).allow(''),
    country: Joi.string().allow(null).allow('')

})

//contact phone validation

const BusinessContactPhoneSchema = Joi.object().keys({
    phoneType: Joi.number().required(),
    phoneNumber: Joi.string().allow(null).allow(''),
    status: Joi.number().required(),
    phoneCountryCode: Joi.string().allow('')

})

//#region  business contact
const BusinessContactSchema = Joi.object().keys({
    businessId: Joi.string().uuid().trim().required(),
    contactName: Joi.string().trim().required(),
    isSupplier: Joi.boolean().required(),
    isCustomer: Joi.boolean().required(),
    isEmployee: Joi.boolean().required(),
    active: Joi.boolean().required(),
    platformContactId: Joi.string().trim().required(),
    contactAddress: Joi.array().items(BusinessContactAdressSchema).min(0),
    contactPhone: Joi.array().items(BusinessContactPhoneSchema).min(0),
    description: Joi.string().allow('', null),
    email: Joi.string().allow('', null)
});


export const AddContactsRequestSchema = Joi.object({
    contacts: Joi.array().items(BusinessContactSchema).min(1),
});
//#endregion

//#region  business chart of accounts
export const coaSchema = Joi.object().keys({
    businessId: Joi.string().uuid().trim().required(),
    name: Joi.string().trim().required(),
    accountSubType: Joi.number().optional(),
    parentAccountName: Joi.string().trim().required(),
    classification: Joi.string().trim().required(),
    parentAccountId: Joi.number().required(),
    platformAccountId: Joi.string().trim().required(),
    active: Joi.boolean().required(),
    accountNumber: Joi.string().allow('', null),
    baseCurrency: Joi.string().allow('', null),
    description: Joi.string().allow('', null)
});

export const BusinessChartOfAccountSchema = Joi.object({
    chartOfAccounts: Joi.array().items(coaSchema).min(1),
});
//#endregion

//#region business payment
const businessPaymentSchema = Joi.object().keys({
    transactionId: Joi.string().max(36).required().allow(null),
    businessId: Joi.string().uuid().trim().required(),
    paymentId: Joi.string().max(36).trim().required(),
    paidDate: joiDateFormat.required(),
    active: Joi.boolean().required(),
    transactionType: Joi.string().trim().required(),
    refNumber: Joi.string().max(36).optional().default(null).allow(null, ''),
    contactId: Joi.string().max(36).trim().required(),
    bankId: Joi.string().max(36).optional().default(null).allow(null, ''),
    amount: Joi.number().required(),
    description: Joi.string().allow(null, ''),
    type: Joi.number().required()
});


export const AddBusinessPaymentSchema = Joi.object({
    payments: Joi.array().items(businessPaymentSchema).min(1),
});
//#endregion

//#region business trail balances
export const tialBalanceSchema = Joi.object().keys({
    businessId: Joi.string().uuid().trim().required(),
    trialBalanceDate: joiDateFormat.required(),
    accountId: Joi.string().trim().required(),
    credit: Joi.number().required(),
    debit: Joi.number().required(),
});

export const AddBusinessTrialBalanceSchema = Joi.object({
    trialBalanaces: Joi.array().items(tialBalanceSchema).min(1),
});
//#endregion


export const aRaPagingSchema = Joi.object().keys({
    businessId: Joi.string().uuid().trim().required(),
    date: joiDateFormat.required(),
    transactionId: Joi.string().trim().required(),
    number: Joi.string().allow(''),
    contactId: Joi.string().trim().required(),
    dueDate: joiDateFormat.required(),
    amount: Joi.number().required(),
    balance: Joi.number().required(),
    headId: Joi.number().required(),
    transactionType: Joi.string().allow(null),
});


export const itemSchema = Joi.object().keys({
    businessId: Joi.string().uuid().trim().required(),
    platformId: Joi.string().trim().required(),
    name: Joi.string().trim().required(),
    type: Joi.string().trim().required(),
    fullName: Joi.string().allow('', null),
    salePrice: Joi.number().required().allow(null),
    purchasePrice: Joi.number().required().allow(null),
    status: Joi.number().required().valid(StatusType.true, StatusType.false),
    isSold: Joi.boolean().required(),
    isPurchased: Joi.boolean().required(),
    incomeAccRefId: Joi.string().allow(null),
    expenseAccRefId: Joi.string().allow(null),
});


export const AddBusinessArApAgingSchema = Joi.object({
    arAging: Joi.array().items(aRaPagingSchema).min(1),
});

export const AddBusinessItemSchema = Joi.object({
    items: Joi.array().items(itemSchema).min(1),
});
export const AddBusinessCreditDebitMemoSchema = Joi.object({
    creditDebitMemo: Joi.array().items(AddCreditDebitMemoSchema).min(1),
});

export const journalTransactionRequest = Joi.object({
    jv: Joi.array().items(journal),
    transaction: Joi.array().items(businessTransaction),
});
export const journalTransactionDeleteRequest = Joi.object({
    jv: Joi.array().items(Joi.string()),
    transaction: Joi.array().items(Joi.string()),
});
export const DeleteBusinessWebhookInvoicesBills = Joi.object({
    platformIds: Joi.array().items(Joi.string())
});

const invoiceBillsLineItems = Joi.object().keys({
    description: Joi.string().max(500).optional(),
    itemId: Joi.string().max(255).optional(),
    accountCode: Joi.string().max(255).allow(null).optional(),
    lineNumber: Joi.number().optional(),
    lineAmount: Joi.number().required(),
    quantity: Joi.number().optional(),
    unitPrice: Joi.number().optional(),
    accountId: Joi.string().required().allow(null)

});

const invoiceBillsSchema = Joi.object().keys({
    number: Joi.string().max(255).optional(),
    date: Joi.date().required(),
    dueDate: Joi.date().optional(),
    shipDate: Joi.date().optional(),
    trackingNo: Joi.string().max(255).optional(),
    totalLineItem: Joi.number().required(),
    lineAmountType: Joi.number().optional(),
    amount: Joi.number().required(),
    balance: Joi.number().required(),
    totalTax: Joi.number().optional(),
    platformId: Joi.string().max(255).required(),
    type: Joi.number().required(),
    contactId: Joi.string().max(255).required(),
    lines: Joi.array().items(invoiceBillsLineItems).min(1),
    currency: Joi.string().max(255).required(),
    exchangeRate: Joi.number().optional().allow(null),
    accountId: Joi.string().max(255).required().allow(null, ''),
    description: Joi.string().allow(null, '')
});



const purchaseOrdersLineItems = Joi.object().keys({
    lineNumber: Joi.number().required(),
    lineId: Joi.string().max(255).required().allow(null),
    poId: Joi.string().max(255).required(),
    description: Joi.string().max(500).required().allow(null, ''),
    lineAmount: Joi.number().required(),
    quantity: Joi.number().optional(),
    unitPrice: Joi.number().optional(),
    itemId: Joi.string().max(255).optional().allow(null),
    accountId: Joi.string().required().allow(null)
    // accountCode: Joi.string().max(255).allow(null).optional(),

});

const purchaseOrdersSchema = Joi.object().keys({
    purchaseOrderId: Joi.string().max(255).required(),
    date: joiDateFormat.required(),
    deliveryDate: joiDateFormat.optional(),
    shipDate: Joi.date().optional(),
    reference: Joi.string().max(255).optional().allow(''),
    contactId: Joi.string().max(255).required(),
    accountId: Joi.string().max(255).required().allow(null),
    deliveryInstructions: Joi.string().max(500).required().allow(null, ''),
    currency: Joi.string().max(255).required(),
    exchangeRate: Joi.number().optional().allow(null),
    amount: Joi.number().required(),
    totalTax: Joi.number().required(),
    status: Joi.number().required(),
    poLines: Joi.array().items(purchaseOrdersLineItems).min(1),
    totalLineItem: Joi.number().required(),
});

export const AddBusinessPurchaseOrdersSchema = Joi.object({
    purchaseOrders: Joi.array().items(purchaseOrdersSchema).min(1),
});

export const AddBusinessInvoiceBillsSchema = Joi.object({
    invoiceBills: Joi.array().items(invoiceBillsSchema).min(1),
});

const longTermForecasting = Joi.object().keys({
    date: Joi.date().required(),
    amount: Joi.number().required(),
    accountId: Joi.string().trim().required(),
    parentAccountId: Joi.string().trim().required()
});

const AddBusinessLongTermForecastingSchema = Joi.object({
    longTermData: Joi.array().items(longTermForecasting)
});

export const DeleteBusinessWebhookItems = Joi.object({
    platformIds: Joi.array().items(Joi.string())
});

export const DeleteBusinessPayment = Joi.object({
    deletedPayments: Joi.array().items(Joi.string()),
});

export const InstituteIdSchema = Joi.object({
    instituteid: Joi.string().required(),
});

export const businessIdSchema = Joi.object({
    businessId: Joi.string().uuid().required(),
});

export const businessPlatformIdSchema = Joi.object({
    platformId: Joi.string().required(),
});

const totalTaxComponentsLines = Joi.object().keys({
    lineNumber: Joi.number().required(),
    name: Joi.string().max(255).required(),
    rate: Joi.number().required(),
    platformTaxId: Joi.string().max(255).required(),
});

const taxSchema = Joi.object().keys({
    platformTaxId: Joi.string().max(255).required(),
    name: Joi.string().max(255).required(),
    effectiveRate: Joi.number().required(),
    status: Joi.number().required(),
    totalTaxComponents: Joi.number().required(),
    taxComponents: Joi.array().items(totalTaxComponentsLines).min(1),
});

export const AddBusinessTaxSchema = Joi.object({
    tax: Joi.array().items(taxSchema).min(1),
});


const DapValidationSchema = Joi.object().keys({
    id: Joi.string().required(),
    journalDate: joiDateFormat.required(),
    transactionId: Joi.string().trim().required(),
    transactionType: Joi.string().trim().required(),
    number: Joi.string().allow('', null),
    contactId: Joi.string().allow('', null),
    description: Joi.string().allow('', null),
    accountId: Joi.string().allow('', null),
    amount: Joi.number().required(),
    isReconciled: Joi.boolean().required().allow(1, 0),
    active: Joi.boolean().required().allow(1, 0),
    createdAt: Joi.string().trim().required(),
    updatedAt: Joi.string().trim().required(),
    version: Joi.number(),
    businessId: Joi.string().uuid(),
    platformAccountId: Joi.string().trim().required(),
    name: Joi.string().required(),
    accountSubType: Joi.number().required(),
    parentAccountName: Joi.string().trim().required(),
    baseCurrency: Joi.string().allow('', null),
    classification: Joi.string().trim().required(),
    parentAccountId: Joi.number().required(),
    accountNumber: Joi.string().allow('', null),
    bankAccountId: Joi.string().allow('', null),
});


export const DapDataValidationSchema = Joi.object({
    dap: Joi.array().items(DapValidationSchema),
});

const UpdateBusiness = Joi.object({
    syncFrequency: Joi.number().valid(SyncIntervals.ThreeHours, SyncIntervals.OneDay, SyncIntervals.OneWeek),
    autoSync: Joi.boolean()
});

const UpdateInstituteBusinesses = Joi.object({
    syncFrequency: Joi.number().valid(SyncIntervals.ThreeHours, SyncIntervals.OneDay, SyncIntervals.OneWeek).required()
});


const ProviderSchema = Joi.object({
    provider: Joi.number().allow(ProviderType.qb,ProviderType.xero, ProviderType.sage, ProviderType.wave, ProviderType.myOb, ProviderType.saasu, ProviderType.freshBooks, ProviderType.clearBooks, ProviderType.sagentAcct, ProviderType.reckon,ProviderType.zoho, ProviderType.tally, ProviderType.freeAgent, ProviderType.microsoft, ProviderType.basiq, ProviderType.plaid).required(),
})

const bankAccountMappingTransactionObj = Joi.object().keys({
    bankTransactionId: Joi.string().trim().required(),
    //businessId: Joi.string().uuid().trim().required(),
    accountTransactionId: Joi.string().trim().required(),
    isOutlier: Joi.boolean().required(),
    isSuspicious: Joi.boolean().required(),
    trustScore: Joi.number().required(),
    confidenceScore: Joi.number().required(),
});

const AddBankAccountTransactionMappingSchema = Joi.object({
    bankAccountMappingTransactionData: Joi.array().items(bankAccountMappingTransactionObj)
});

export const BusinessValidations =
{
    AddBusinessSchema,
    BusinessTransactionSchema,
    BusinessJournalSchema,
    AddContactsRequestSchema,
    AddBusinessCreditDebitMemoSchema,
    BusinessChartOfAccountSchema,
    AddBusinessPaymentSchema,
    AddBusinessTrialBalanceSchema,
    AddBusinessArApAgingSchema,
    AddBusinessItemSchema,
    AddBusinessLongTermForecastingSchema,
    DeleteBusinessWebhookInvoicesBills,
    AddBusinessInvoiceBillsSchema,
    journalTransactionRequest,
    journalTransactionDeleteRequest,
    DeleteBusinessWebhookItems,
    DeleteBusinessPayment,
    businessIdSchema,
    AddBusinessTaxSchema,
    AddBusinessPurchaseOrdersSchema,
    DapDataValidationSchema,
    UpdateBusiness,
    UpdateInstituteBusinesses,
    ProviderSchema,
    businessPlatformIdSchema,
    AddBankAccountTransactionMappingSchema
};

// Update token schemea
export const UpdateTokenSchema = Joi.object().keys({
    accessToken: Joi.string().trim().required(),
    refreshToken: Joi.string().trim().required(),
    refreshTokenExpiresAt: Joi.date().required(),
    accessTokenExpireTime: Joi.date().required(),
    id: Joi.string().trim().required(),
    status: Joi.any()
});

// Update sync date
export const UpdateSyncdateSchema = Joi.object().keys({
    date: Joi.string().required(),
    businessId: Joi.string().uuid().trim().required()
});

export const UpdateXeroTokenSchema = Joi.object().keys({
    accessToken: Joi.string().trim().required(),
    refreshToken: Joi.string().trim().required(),
    refreshTokenExpiresAt: Joi.date().required(),
    accessTokenExpireTime: Joi.date().required(),
    realmIds: Joi.array().required()
});

// Update sync date
export const UpdateIndustryAndSubIndustrySchema = Joi.object().keys({
    industryType: Joi.string().required(),
    subIndustryType: Joi.string().required()
});


// Update sync setting pagination Schema
export const SyncSettingPaginationQueryParams = Joi.object().keys({
    pageNumber: Joi.alternatives().conditional('pageSize', { is: Joi.exist(), then: Joi.number().min(1).required(), otherwise: Joi.optional() }),
    pageSize: Joi.alternatives().conditional('pageNumber', { is: Joi.exist(), then: Joi.number().min(1).max(10000).required(), otherwise: Joi.optional() })
});
// business sync setting filter schema 
export const BusinessSyncSettingSearchQueryParams = SyncSettingPaginationQueryParams.keys({
    searchTerm: Joi.string().min(2).required()
});
