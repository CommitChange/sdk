window.commitchange = {
  iframes: []
, modalIframe: null
}

commitchange.openDonationModal = (iframe, overlay) => {
  return (event) => {
    overlay.className = 'commitchange-overlay commitchange-open'
    iframe.className = 'commitchange-iframe commitchange-open'
    commitchange.setParams(commitchange.getParamsFromButton(event.currentTarget), iframe)
    commitchange.open_iframe = iframe
    commitchange.open_overlay = overlay
  }
}

// Dynamically set the params of the appended iframe donate window
commitchange.setParams = (params, iframe) => {
  params.command = 'setDonationParams'
  params.sender = 'commitchange'
  iframe.contentWindow.postMessage(JSON.stringify(params), fullHost)
}

commitchange.hideDonation = () => {
  if(!commitchange.open_overlay || !commitchange.open_iframe) return
  commitchange.open_overlay.className = 'commitchange-overlay commitchange-closed'
  commitchange.open_iframe.className = 'commitchange-iframe commitchange-closed'
  commitchange.open_overlay = undefined
  commitchange.open_iframe = undefined
}

const fullHost = 'https://commitchange.com'

commitchange.overlay = () => {
  let div = document.createElement('div')
  div.setAttribute('class', 'commitchange-closed commitchange-overlay')
  return div
}

commitchange.createIframe = (source) => {
  let i = document.createElement('iframe')
  const url = document.location.href
  i.setAttribute('class', 'commitchange-closed commitchange-iframe')
  i.src = source + "&origin=" + url
  return i
}

// Given a button with a bunch of data parameters
// return an object of key/vals corresponing to each param
commitchange.getParamsFromButton = (elem) => {
  let options = {
    offsite: 't'
  , type: elem.getAttribute('data-type')
  , custom_amounts: elem.getAttribute('data-custom-amounts') || elem.getAttribute('data-amounts')
  , custom_fields: elem.getAttribute('data-custom-fields')
  , campaign_id: elem.getAttribute('data-campaign-id')
  , gift_option_id: elem.getAttribute('data-gift-option-id')
  , redirect: elem.getAttribute('data-redirect')
  , designation: elem.getAttribute('data-designation')
  , multiple_designations: elem.getAttribute('data-multiple-designations')
  , hide_dedication: elem.getAttribute('data-hide-dedication')
  , designations_prompt: elem.getAttribute('data-designations-prompt')
  , single_amount: elem.getAttribute('data-single-amount') || elem.getAttribute('data-amount')
  , designation_desc: elem.getAttribute('data-designation-desc') || elem.getAttribute('data-description')


  }
  // Remove false values from the options
  for(let key in options) {
    if(!options[key]) delete options[key]
  }
  return options
}

commitchange.appendMarkup = () => {
  if(commitchange.alreadyAppended) return
  else commitchange.alreadyAppended = true
  let script = document.getElementById('commitchange-donation-script') || document.getElementById('commitchange-script')
  const nonprofitID = script.getAttribute('data-npo-id')
  const baseSource = fullHost + "/nonprofits/" + nonprofitID + "/donate?offsite=t"
  let elems = document.querySelectorAll('.commitchange-donate')

  for(let i = 0; i < elems.length; ++i) {
    let elem = elems[i]
    let source = baseSource

    let options = commitchange.getParamsFromButton(elem)
    let params = []
    for(let key in options) {
      params.push(key + '=' + options[key])
    }
    source += "&" + params.join("&")

    if(elem.hasAttribute('data-embedded')) {
      source += '&mode=embedded'
      let iframe = commitchange.createIframe(source)
      elem.appendChild(iframe)
      iframe.setAttribute('class', 'commitchange-iframe-embedded')
      commitchange.iframes.push(iframe)
    } else {
      // Show the CommitChange-branded button if it's not set to custom.
      if(!elem.hasAttribute('data-custom') && !elem.hasAttribute('data-custom-button')) {
        let btn_iframe = document.createElement('iframe')
        let btn_src = fullHost + "/nonprofits/" + nonprofitID + "/btn"
        if(elem.hasAttribute('data-fixed')) { btn_src += '?fixed=t' }
        btn_iframe.src = btn_src
        btn_iframe.className = 'commitchange-btn-iframe'
        btn_iframe.setAttribute('scrolling', 'no')
        btn_iframe.setAttribute('seamless', 'seamless')
        elem.appendChild(btn_iframe)
        btn_iframe.onclick = commitchange.openDonationModal(iframe, overlay)
      }
      // Create the iframe overlay for this button
      let modal = document.createElement('div')
      modal.className = 'commitchange-modal'
      let overlay = commitchange.overlay()
      let iframe
      if(commitchange.modalIframe) {
        iframe = commitchange.modalIframe
      } else {
        iframe = commitchange.createIframe(source)
        commitchange.iframes.push(iframe)
        commitchange.modalIframe = iframe
      }
      modal.appendChild(overlay)
      document.body.appendChild(iframe)
      elem.parentNode.appendChild(modal)
      overlay.onclick = commitchange.hideDonation
      elem.onclick = commitchange.openDonationModal(iframe, overlay)
    } // end else
  } // end for loop
}

// Load the CSS for the parent page element from our AWS server
commitchange.loadStylesheet = () => {
  if(commitchange.alreadyStyled) return
  else commitchange.alreadyStyled = true
  let stylesheet = document.createElement('link')
  const host = "https://s3-us-west-1.amazonaws.com"
  const path = "/commitchange/manual/donate-button.v2.css"
  stylesheet.href = host + path
  stylesheet.rel  = 'stylesheet'
  stylesheet.type = 'text/css'
  document.getElementsByTagName('head')[0].appendChild(stylesheet)
}


// Handle iframe post messages
if(window.addEventListener) {
  window.addEventListener('message', (e) => {
    // Close the modal
    if(e.data === 'commitchange:close') {
      commitchange.hideDonation()
    } 
    // Redirect on donation completion using the redirect param
    else if(e.data.match(/^commitchange:redirect/)) {
      const matches = e.data.match(/^commitchange:redirect:(.+)$/)
      if(matches.length === 2) window.location.href = matches[1]
    }
  })
}

// Make initialization calls on document load
if(document.addEventListener) {
  document.addEventListener("DOMContentLoaded", (event) => {
    commitchange.loadStylesheet()
    commitchange.appendMarkup()
  })
} else if(window.jQuery) {
  window.jQuery(document).ready(() => {
    commitchange.loadStylesheet()
    commitchange.appendMarkup()
  })
} else {
  window.onload = () => {
    commitchange.loadStylesheet()
    commitchange.appendMarkup()
  }
}

if(document.querySelector('.commitchange-donate')) {
  commitchange.loadStylesheet()
  commitchange.appendMarkup()
}
