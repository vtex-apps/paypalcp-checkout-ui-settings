/* eslint-disable camelcase */
/* eslint-disable no-undef */
const MAX_TIME_EXPIRATION = 1000 * 60 * 5 // 5 minutes
const GRAPHQL_ENDPOINT = '/_v/private/graphql/v1'
const ISO3_ENDPOINT =
  '/_v/vtex.connector-paypal-commerce-platform/v0/country-code/'

// const GATEWAY_CALLBACK_ENDPOINT = '/api/checkout/pub/gatewayCallback/'
const SETTINGS_ENDPOINT = `/_v/vtex.connector-paypal-commerce-platform/v0/settings`
const OrderFormFragment = `id
    items {
      additionalInfo {
        brandName
      }
      attachments {
        name
        content
      }
      attachmentOfferings {
        name
        required
        schema
      }
      bundleItems {
        additionalInfo {
            brandName
          }
          attachments {
            name
            content
          }
          attachmentOfferings {
            name
            required
            schema
          }
          availability
          detailUrl
          id
          imageUrls {
            at1x
            at2x
            at3x
          }
          listPrice
          measurementUnit
          name
          offerings {
            id
            name
            price
            type
            attachmentOfferings {
              name
              required
              schema
            }
          }
          price
          productCategories
          productCategoryIds
          productRefId
          productId
          quantity
          seller
          sellingPrice
          skuName
          skuSpecifications {
            fieldName
            fieldValues
          }
          unitMultiplier
          uniqueId
          refId
      }
      parentAssemblyBinding
      parentItemIndex
      sellingPriceWithAssemblies
      options {
        assemblyId
        id
        quantity
        seller
        inputValues
        options {
          assemblyId
          id
          quantity
          seller
          inputValues
          options {
            assemblyId
            id
            quantity
            seller
            inputValues
          }
        }
      }
      availability
      detailUrl
      id
      imageUrls {
        at1x
        at2x
        at3x
      }
      listPrice
      manualPrice
      measurementUnit
      modalType
      name
      offerings {
        id
        name
        price
        type
        attachmentOfferings {
          name
          required
          schema
        }
      }
      price
      priceTags {
        identifier
        isPercentual
        name
        rawValue
        value
      }
      productCategories
      productCategoryIds
      productRefId
      productId
      quantity
      seller
      sellingPrice
      skuName
      skuSpecifications {
        fieldName
        fieldValues
      }
      unitMultiplier
      uniqueId
      refId
      priceTags {
        identifier
        isPercentual
        rawValue
        value
        name
        ratesAndBenefitsIdentifier {
          description
          id
          featured
          name
          matchedParameters
        }
      }
      isGift
      priceDefinition {
        calculatedSellingPrice
        total
        sellingPrices {
          quantity
          value
        }
      }
    }
    canEditData
    loggedIn
    userProfileId
    userType
    marketingData {
    coupon
    utmCampaign
    utmMedium
    utmSource
    utmiCampaign
    utmiPart
    utmiPage
    }
    totalizers {
    id
    name
    value
    }
    shipping {
    countries
    availableAddresses {
        addressId
        addressType
        city
        complement
        country
        neighborhood
        number
        postalCode
        receiverName
        reference
        state
        street
        isDisposable
        geoCoordinates
    }
    selectedAddress {
        addressId
        addressType
        city
        complement
        country
        neighborhood
        number
        postalCode
        receiverName
        reference
        state
        street
        isDisposable
        geoCoordinates
    }
    deliveryOptions {
        id
        deliveryChannel
        price
        estimate
        isSelected
    }
    pickupOptions {
        id
        address {
            addressId
            addressType
            city
            complement
            country
            neighborhood
            number
            postalCode
            receiverName
            reference
            state
            street
            isDisposable
            geoCoordinates
        }
        deliveryChannel
        price
        estimate
        isSelected
        friendlyName
        additionalInfo
        storeDistance
        transitTime
        businessHours {
        dayNumber
        closed
        closingTime
        openingTime
        }
    }
    isValid
    }
    paymentData {
    paymentSystems {
        id
        name
        groupName
        validator {
        regex
        mask
        cardCodeRegex
        cardCodeMask
        weights
        useCvv
        useExpirationDate
        useCardHolderName
        useBillingAddress
        }
        stringId
        requiresDocument
        isCustom
        description
        requiresAuthentication
        dueDate
    }
    payments {
        paymentSystem
        bin
        accountId
        tokenId
        installments
        referenceValue
        value
    }
    installmentOptions {
        paymentSystem
        installments {
        count
        hasInterestRate
        interestRate
        value
        total
        }
    }
    availableAccounts {
        accountId
        paymentSystem
        paymentSystemName
        cardNumber
        bin
    }
    isValid
    }
    clientProfileData {
    email
    firstName
    lastName
    document
    documentType
    phone
    isValid
    }
    clientPreferencesData {
    locale
    optInNewsletter
    }
    messages {
    couponMessages {
        code
    }
    generalMessages {
        code
        text
        status
    }
    }
    value
    allowManualPrice
    customData {
    customApps {
        fields
        id
        major
    }
    }`

const CREATE_ORDER_MUTATION = `mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input)
      @context(provider: "vtex.connector-paypal-commerce-platform")
  }`

const UPDATE_ORDER_MUTATION = `mutation UpdateOrder($input: UpdateOrderInput!) {
    updateOrder(input: $input)
      @context(provider: "vtex.connector-paypal-commerce-platform")
  }
  `

const PLACE_ORDER_MUTATION = `mutation PlaceOrder($orderFormId: String!, $paypalOrderId: String!) {
    placeOrder(
      input: { orderFormId: $orderFormId, paypalOrderId: $paypalOrderId }
    ) @context(provider: "vtex.connector-paypal-commerce-platform") {
      orderGroup
      checkoutAuth
    }
  }
  `

const COMPLETE_ORDER_MUTATION = `mutation CompleteOrder($orderFormId: String!, $orderGroup: String!, $checkoutAuth: String!) {
    completeOrder(
      input: { orderFormId: $orderFormId, orderGroup: $orderGroup, checkoutAuth: $checkoutAuth }
    ) @context(provider: "vtex.connector-paypal-commerce-platform") {
      orderGroup
      checkoutAuth
    }
  }
  `

const ORDERFORM_QUERY = `query getOrderForm($orderFormId: ID) {
    orderForm(orderFormId: $orderFormId, refreshOutdatedData: true)
      @context(provider: "vtex.checkout-graphql", scope: "private") {
      ${OrderFormFragment}
    }
  }`

const ESTIMATE_SHIPPING_MUTATION = `mutation estimateShipping($addressInput: AddressInput) {
    estimateShipping(address: $addressInput)
      @context(provider: "vtex.checkout-graphql") {
      ${OrderFormFragment}
    }
  }`

const SELECT_DELIVERY_OPTION_MUTATION = `mutation selectDeliveryOption($deliveryOptionId: String) {
    selectDeliveryOption(deliveryOptionId: $deliveryOptionId)
      @context(provider: "vtex.checkout-graphql") {
      ${OrderFormFragment}
    }
  }`

const SELECT_PICKUP_OPTION_MUTATION = `mutation selectPickupOption($pickupOptionId: String) {
    selectPickupOption(pickupOptionId: $pickupOptionId)
      @context(provider: "vtex.checkout-graphql") {
      ${OrderFormFragment}
    }
  }`

const generateItemsArray = (orderForm, currency) => {
  let hasDeliveryErrors = false

  const returnArray = orderForm.items.map((item) => {
    if (item.availability === 'cannotBeDelivered') {
      hasDeliveryErrors = true
    }

    const name =
      item.name.length > 127 ? `${item.name.substring(0, 124)}...` : item.name

    const description =
      item.skuName.length > 127
        ? `${item.skuName.substring(0, 124)}...`
        : item.skuName

    return {
      name,
      unit_amount: {
        value: item.isGift ? '0.00' : (item.price / 100).toFixed(2),
        currency_code: currency,
      },
      quantity: item.quantity * item.unitMultiplier,
      description,
      sku: item.id,
    }
  })

  if (hasDeliveryErrors) return []

  return returnArray
}

const generateShippingOptions = (orderForm, currency, pickupEnabled) => {
  if (
    !orderForm?.shipping?.deliveryOptions?.length &&
    (!pickupEnabled || !orderForm?.shipping?.pickupOptions?.length)
  ) {
    return []
  }

  const shippingOptions = orderForm.shipping.deliveryOptions.map((option) => {
    return {
      id: option.id,
      label: option.id,
      type: 'SHIPPING',
      selected: option.isSelected,
      amount: {
        value: (option.price / 100).toFixed(2),
        currency_code: currency,
      },
    }
  })

  const pickupOptions = pickupEnabled
    ? orderForm.shipping.pickupOptions.map((option) => {
        return {
          id: option.id,
          label: option.friendlyName,
          type: 'PICKUP',
          selected: option.isSelected,
          amount: {
            value: (option.price / 100).toFixed(2),
            currency_code: currency,
          },
        }
      })
    : []

  return [...pickupOptions, ...shippingOptions]
}

const getSelectedPickupLocation = (orderForm) => {
  if (!orderForm?.shipping?.pickupOptions?.length) {
    return null
  }

  return orderForm.shipping.pickupOptions.filter(
    (option) => option.isSelected
  )[0]
}

const generateBreakdown = (totalizers, currency) => {
  const breakdown = {}
  let totalTax = 0

  totalizers.forEach((totalizer) => {
    if (totalizer.id === 'Items') {
      breakdown.item_total = {
        value: (totalizer.value / 100).toFixed(2),
        currency_code: currency,
      }

      return
    }

    if (totalizer.id === 'Shipping') {
      breakdown.shipping = {
        value: (totalizer.value / 100).toFixed(2),
        currency_code: currency,
      }

      return
    }

    if (totalizer.id === 'Discounts') {
      breakdown.discount = {
        value: Math.abs(totalizer.value / 100).toFixed(2),
        currency_code: currency,
      }

      return
    }

    if (totalizer.id.toLowerCase().includes('tax')) {
      totalTax += totalizer.value
    }
  })

  breakdown.tax_total = {
    value: (totalTax / 100).toFixed(2),
    currency_code: currency,
  }

  return breakdown
}

!(() => {
  console.info('PayPal Smart Buttons')
  let checkPayPalSettings = null

  // Used to remove cache from requests
  const isWorkspace = () => {
    return window.__RUNTIME__.workspace !== 'master'
  }

  let payPalSettings
  const storedPayPalSettings = JSON.parse(
    window.sessionStorage.getItem('paypal-settings')
  )

  if (storedPayPalSettings?.time) {
    const now = new Date().getTime()
    const sessionStorageCheckoutTime = new Date(
      storedPayPalSettings.time
    ).getTime()

    if (now - sessionStorageCheckoutTime < MAX_TIME_EXPIRATION) {
      payPalSettings = storedPayPalSettings
    }
  }

  window.payPalSettings = window.payPalSettings || payPalSettings

  const handleShippingUpdate = async (address, rootPath) => {
    const { city, country_code, postal_code, state } = address

    const countryCode =
      country_code.length === 2
        ? await fetch(`${rootPath}${ISO3_ENDPOINT}${country_code}`)
            .then((response) => response.json())
            .then((response) => response.code)
        : country_code

    const addressInput = {
      neighborhood: 'N/A',
      city,
      country: countryCode,
      postalCode: postal_code,
      state,
      isDisposable: true,
    }

    return fetch(`${rootPath}${GRAPHQL_ENDPOINT}`, {
      method: 'POST',
      body: JSON.stringify({
        query: ESTIMATE_SHIPPING_MUTATION,
        variables: { addressInput },
      }),
    })
  }

  const handleSelectShippingOption = async (data, rootPath) => {
    const { selected_shipping_option } = data

    if (selected_shipping_option.type === 'PICKUP') {
      return fetch(`${rootPath}${GRAPHQL_ENDPOINT}`, {
        method: 'POST',
        body: JSON.stringify({
          query: SELECT_PICKUP_OPTION_MUTATION,
          variables: { pickupOptionId: selected_shipping_option.id },
        }),
      })
    }

    return fetch(`${rootPath}${GRAPHQL_ENDPOINT}`, {
      method: 'POST',
      body: JSON.stringify({
        query: SELECT_DELIVERY_OPTION_MUTATION,
        variables: { deliveryOptionId: selected_shipping_option.id },
      }),
    })
  }

  const checkSelectedShippingOption = async (currentOrderForm, rootPath) => {
    if (
      !currentOrderForm?.shipping?.deliveryOptions?.length ||
      currentOrderForm.shipping.deliveryOptions.some((opt) => opt.isSelected)
    ) {
      return currentOrderForm
    }

    const {
      city,
      country: country_code,
      postalCode: postal_code,
      state,
    } = currentOrderForm.shipping.selectedAddress

    await handleShippingUpdate(
      {
        city,
        country_code,
        postal_code,
        state,
      },
      rootPath
    )

    return fetch(`${rootPath}${GRAPHQL_ENDPOINT}`, {
      method: 'POST',
      body: JSON.stringify({
        query: SELECT_DELIVERY_OPTION_MUTATION,
        variables: {
          deliveryOptionId: currentOrderForm.shipping.deliveryOptions[0].id,
        },
      }),
    })
      .then((response) => response.json())
      .then(({ data: selectResult }) => {
        const newOrderForm = selectResult?.selectDeliveryOption

        if (!newOrderForm) {
          return currentOrderForm
        }

        return newOrderForm
      })
  }

  const renderButtons = async () => {
    if (typeof paypal === 'undefined') {
      return
    }

    const rootPath = window?.vtex?.renderRuntime?.rootPath ?? ''

    const {
      layout,
      color,
      shape,
      showTagline,
      immediateCapture,
      sellerEmail,
      merchantId,
      enablePickup = false,
    } = window.payPalSettings

    const { orderFormId } = vtexjs.checkout
    const currency = vtexjs.checkout.orderForm.storePreferencesData.currencyCode

    paypal
      .Buttons({
        style: {
          layout,
          color,
          shape,
          ...(layout === 'horizontal' ? { tagline: showTagline } : {}),
        },
        createOrder(_data, _actions) {
          return fetch(`${rootPath}${GRAPHQL_ENDPOINT}`, {
            method: 'POST',
            body: JSON.stringify({
              query: ORDERFORM_QUERY,
              variables: {
                orderFormId,
              },
            }),
          })
            .then((response) => response.json())
            .then(({ data }) => {
              const { orderForm } = data

              return checkSelectedShippingOption(orderForm, rootPath).then(
                (newOrderForm) => {
                  const items = generateItemsArray(newOrderForm, currency)

                  if (!items.length) return null

                  const shippingOptions = generateShippingOptions(
                    newOrderForm,
                    currency,
                    enablePickup
                  )

                  const breakdown = generateBreakdown(
                    newOrderForm.totalizers,
                    currency
                  )

                  return fetch(`${rootPath}${GRAPHQL_ENDPOINT}`, {
                    method: 'POST',
                    body: JSON.stringify({
                      query: CREATE_ORDER_MUTATION,
                      variables: {
                        input: {
                          intent: immediateCapture ? 'CAPTURE' : 'AUTHORIZE',
                          amount: {
                            value: (newOrderForm.value / 100).toFixed(2),
                            currency_code: currency,
                            breakdown,
                          },
                          payee: {
                            email_address: sellerEmail,
                            merchant_id: merchantId,
                          },
                          items,
                          shipping: {
                            options:
                              shippingOptions && shippingOptions.length > 0
                                ? shippingOptions
                                : null,
                          },
                        },
                      },
                    }),
                  })
                    .then((response) => response.json())
                    .then(({ data: newData }) => {
                      if (!newData) return null

                      return newData.createOrder
                    })
                }
              )
            })
        },
        onShippingChange(data, actions) {
          const { shipping_address } = data

          // always run the shipping estimate mutation to make sure we have the latest orderForm
          return handleShippingUpdate(shipping_address, rootPath)
            .then((response) => response.json())
            .then(({ data: result }) => {
              if (!result) {
                return actions.reject()
              }

              let newOrderForm = result.estimateShipping

              if (!newOrderForm) {
                return actions.reject()
              }

              const { shipping, totalizers } = newOrderForm

              if (
                !shipping?.deliveryOptions?.length &&
                !shipping?.pickupOptions?.length
              ) {
                return actions.reject()
              }

              const newItems = generateItemsArray(newOrderForm, currency)

              if (!newItems?.length) return actions.reject()

              // if the selected shipping option in paypal hasn't been selected in VTEX,
              // select it and then patch the paypal order with the new orderForm data.
              // This conditional is for delivery options, see below for pickup
              if (
                data.selected_shipping_option?.id &&
                shipping.deliveryOptions.find(
                  (option) =>
                    option.id === data.selected_shipping_option.id &&
                    (option.price / 100).toFixed(2) ===
                      data.selected_shipping_option.amount.value &&
                    !option.isSelected
                )
              ) {
                return handleSelectShippingOption(data, rootPath)
                  .then((response) => response.json())
                  .then(({ data: selectResult }) => {
                    if (!selectResult) {
                      return actions.reject()
                    }

                    newOrderForm = selectResult.selectDeliveryOption

                    if (!newOrderForm) {
                      return actions.reject()
                    }

                    const { totalizers: newTotalizers } = newOrderForm

                    const newShippingOptions = generateShippingOptions(
                      newOrderForm,
                      currency,
                      enablePickup
                    )

                    const newBreakdown = generateBreakdown(
                      newTotalizers,
                      currency
                    )

                    const input = {
                      orderId: data.orderID,
                      amount: {
                        value: (newOrderForm.value / 100).toFixed(2),
                        currency_code: currency,
                        breakdown: newBreakdown,
                      },
                      payee: {
                        email_address: sellerEmail,
                        merchant_id: merchantId,
                      },
                      items: newItems,
                      shipping: {
                        options: newShippingOptions,
                      },
                    }

                    return fetch(`${rootPath}${GRAPHQL_ENDPOINT}`, {
                      method: 'POST',
                      body: JSON.stringify({
                        query: UPDATE_ORDER_MUTATION,
                        variables: { input },
                      }),
                    })
                      .then((response) => response.json())
                      .then(({ data: updateOrderResult }) => {
                        if (!updateOrderResult?.updateOrder) {
                          return actions.reject()
                        }

                        return actions.resolve()
                      })
                  })
              }

              // pickup
              if (
                data.selected_shipping_option?.id &&
                shipping.pickupOptions?.find(
                  (option) =>
                    option.id === data.selected_shipping_option.id &&
                    (option.price / 100).toFixed(2) ===
                      data.selected_shipping_option.amount.value &&
                    !option.isSelected
                )
              ) {
                return handleSelectShippingOption(data, rootPath)
                  .then((response) => response.json())
                  .then(({ data: selectResult }) => {
                    if (!selectResult) {
                      return actions.reject()
                    }

                    newOrderForm = selectResult.selectPickupOption

                    if (!newOrderForm) {
                      return actions.reject()
                    }

                    const { totalizers: newTotalizers } = newOrderForm

                    const newShippingOptions = generateShippingOptions(
                      newOrderForm,
                      currency,
                      enablePickup
                    )

                    const newBreakdown = generateBreakdown(
                      newTotalizers,
                      currency
                    )

                    const pickupLocation = getSelectedPickupLocation(
                      newOrderForm
                    )

                    if (!pickupLocation) {
                      return actions.reject()
                    }

                    const input = {
                      orderId: data.orderID,
                      amount: {
                        value: (newOrderForm.value / 100).toFixed(2),
                        currency_code: currency,
                        breakdown: newBreakdown,
                      },
                      payee: {
                        email_address: sellerEmail,
                        merchant_id: merchantId,
                      },
                      items: newItems,
                      shipping: {
                        options: newShippingOptions,
                        name: {
                          full_name: `S2S ${pickupLocation.friendlyName}`,
                        },
                        address: {
                          address_line_1: pickupLocation.address.street,
                          admin_area_2: pickupLocation.address.city,
                          admin_area_1: pickupLocation.address.state,
                          postal_code: pickupLocation.address.postalCode,
                          country_code: data.shipping_address.country_code,
                        },
                      },
                    }

                    return fetch(`${rootPath}${GRAPHQL_ENDPOINT}`, {
                      method: 'POST',
                      body: JSON.stringify({
                        query: UPDATE_ORDER_MUTATION,
                        variables: { input },
                      }),
                    })
                      .then((response) => response.json())
                      .then(({ data: updateOrderResult }) => {
                        if (!updateOrderResult?.updateOrder) {
                          return actions.reject()
                        }

                        return actions.resolve()
                      })
                  })
              }

              const newShippingOptions = generateShippingOptions(
                newOrderForm,
                currency,
                enablePickup
              )

              const newBreakdown = generateBreakdown(totalizers, currency)

              const isPickup = data.selected_shipping_option?.type === 'PICKUP'

              const pickupLocation = getSelectedPickupLocation(newOrderForm)

              if (isPickup && !pickupLocation) {
                return actions.reject()
              }

              const input = {
                orderId: data.orderID,
                amount: {
                  value: (newOrderForm.value / 100).toFixed(2),
                  currency_code: currency,
                  breakdown: newBreakdown,
                },
                payee: {
                  email_address: sellerEmail,
                  merchant_id: merchantId,
                },
                items: newItems,
                shipping: {
                  options: newShippingOptions,
                  ...(isPickup && {
                    name: {
                      full_name: `S2S ${pickupLocation.friendlyName}`,
                    },
                    address: {
                      address_line_1: pickupLocation.address.street,
                      admin_area_2: pickupLocation.address.city,
                      admin_area_1: pickupLocation.address.state,
                      postal_code: pickupLocation.address.postalCode,
                      country_code: data.shipping_address.country_code,
                    },
                  }),
                },
              }

              return fetch(`${rootPath}${GRAPHQL_ENDPOINT}`, {
                method: 'POST',
                body: JSON.stringify({
                  query: UPDATE_ORDER_MUTATION,
                  variables: { input },
                }),
              })
                .then((response) => response.json())
                .then(({ data: updateOrderResult }) => {
                  if (!updateOrderResult?.updateOrder) {
                    return actions.reject()
                  }

                  return actions.resolve()
                })
            })
            .catch(() => {
              return actions.reject()
            })
        },
        onApprove(data) {
          vtex.checkout.MessageUtils.showPaymentMessage()

          fetch(`${rootPath}${GRAPHQL_ENDPOINT}`, {
            method: 'POST',
            body: JSON.stringify({
              query: PLACE_ORDER_MUTATION,
              variables: {
                orderFormId,
                paypalOrderId: data.orderID,
              },
            }),
          })
            .then((response) => response.json())
            .then(async (result) => {
              if (
                !result?.data?.placeOrder?.orderGroup ||
                !result?.data?.placeOrder?.checkoutAuth
              ) {
                vtex.checkout.MessageUtils.hidePaymentMessage()
                vtex.checkout.MessageUtils.showPaymentUnauthorizedMessage()

                return
              }

              document.cookie = result.data.placeOrder.checkoutAuth

              return fetch(`${rootPath}${GRAPHQL_ENDPOINT}`, {
                method: 'POST',
                body: JSON.stringify({
                  query: COMPLETE_ORDER_MUTATION,
                  variables: {
                    orderFormId,
                    orderGroup: result.data.placeOrder.orderGroup,
                    checkoutAuth: result.data.placeOrder.checkoutAuth,
                  },
                }),
              })
                .then((response) => response.json())
                .then(async (finalResult) => {
                  if (!finalResult?.data?.completeOrder?.orderGroup) {
                    vtex.checkout.MessageUtils.hidePaymentMessage()
                    vtex.checkout.MessageUtils.showPaymentUnauthorizedMessage()

                    return
                  }

                  vtex.checkout.MessageUtils.hidePaymentMessage()

                  window.location = `${rootPath}/checkout/orderPlaced/?og=${result.data.placeOrder.orderGroup}`
                })
            })
            .catch(() => {
              vtex.checkout.MessageUtils.hidePaymentMessage()
              vtex.checkout.MessageUtils.showPaymentUnauthorizedMessage()
            })
        },
        onCancel() {
          vtexjs.checkout
            .getOrderForm()
            .then(() => console.info('User closed PayPal Checkout'))
        },
      })
      .render('#paypal-button-container')
  }

  const createDiv = () => {
    const [buttonContainer] = document.getElementsByClassName('cart-links')

    const paypalDiv = document.createElement('div')

    paypalDiv.id = 'paypal-button-container'

    if (buttonContainer) {
      buttonContainer.appendChild(paypalDiv)
    }
  }

  const loadPayPalScript = async () => {
    const {
      production,
      productionClientId,
      productionBNCode,
      sandboxClientId,
      sandboxBNCode,
      merchantId,
      immediateCapture,
      disablePayPalCredit,
      disableCards,
    } = window.payPalSettings

    const orderForm = await vtexjs.checkout.getOrderForm()
    const currency = orderForm.storePreferencesData.currencyCode

    const script = document.createElement('script')

    const disabledPayments = []

    if (disableCards) disabledPayments.push('card')
    if (disablePayPalCredit) disabledPayments.push('credit')

    script.src = `https://www.paypal.com/sdk/js?client-id=${
      production ? productionClientId : sandboxClientId
    }&merchant-id=${merchantId}&currency=${currency}&intent=${
      immediateCapture ? 'capture' : 'authorize'
    }&commit=true${
      disabledPayments.length
        ? `&disable-funding=${disabledPayments.join(',')}`
        : ``
    }`
    script.setAttribute(
      'data-partner-attribution-id',
      production ? productionBNCode : sandboxBNCode
    )
    document.body.appendChild(script)
  }

  const initializePayPal = async () => {
    if (!window.payPalSettings?.showOnCartPage) {
      return
    }

    if (window.location.hash !== '#/cart') {
      const paypalButtons = document.getElementById('paypal-button-container')

      if (paypalButtons) {
        paypalButtons.remove()
      }

      return
    }

    createDiv()
    await loadPayPalScript()
    const checkPayPalScript = setInterval(() => {
      if (typeof paypal !== 'undefined') {
        clearInterval(checkPayPalScript)
        renderButtons()
      }
    }, 500)
  }

  const handlePayPalSettings = () => {
    if (!payPalSettings) return

    window.payPalSettings = payPalSettings
    initializePayPal()
  }

  const fetchPayPalSettings = () => {
    const rootPath = window?.vtex?.renderRuntime?.rootPath ?? ''

    const ts = new Date().getTime()

    $.ajax({
      url: `${rootPath}${SETTINGS_ENDPOINT}${isWorkspace() ? `?v=${ts}` : ''}`,
    }).then((response) => {
      if (Object.keys(response).length === 0) {
        window.sessionStorage.removeItem('paypal-settings')

        return
      }

      response.time = new Date().toISOString()

      window.sessionStorage.setItem('paypal-settings', JSON.stringify(response))
      payPalSettings = response
      handlePayPalSettings()
    })
  }

  // Wait until we have the vtex runtime to call the functions
  checkPayPalSettings = setInterval(() => {
    if (typeof window?.vtex?.renderRuntime !== 'undefined') {
      clearInterval(checkPayPalSettings)
      if (isWorkspace() || !payPalSettings) {
        fetchPayPalSettings()
      } else {
        handlePayPalSettings()
      }
    }
  }, 500)

  $(window).on('hashchange', () => initializePayPal())
})()
