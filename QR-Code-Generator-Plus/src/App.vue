<template>
  <div class="container">
    <header>
      <h1>QR Code Generator Plus</h1>
      <p class="header-subtitle">
        Created by <a href="https://www.github.com/ismailoksuz" target="_blank">İsmail ÖKSÜZ</a>
      </p>
    </header>
    <main>
      <div class="card">
        <div class="type-selector">
          <label for="qrType">Select QR Type:</label>
          <select id="qrType" v-model="selectedType" @change="resetForm">
            <option value="">Select type...</option>
            <option value="text">Text (Free Text)</option>
            <option value="url">URL (Website Link)</option>
            <option value="email">Email Address</option>
            <option value="phone">Phone Number</option>
            <option value="sms">SMS</option>
            <option value="vcard">V-Card (Contact Card)</option>
            <option value="wifi">Wi-Fi Login</option>
            <option value="location">Location (Coordinates)</option>
            <option value="event">Event (Calendar Item)</option>
            <option value="payment">Payment Information</option>
          </select>
        </div>

        <div v-if="selectedType" class="form-container">
          <h2>{{ getTypeTitle() }}</h2>
          
          <div v-if="selectedType === 'text'" class="form-group">
            <label for="text">Text:</label>
            <textarea id="text" v-model="formData.text" rows="4" placeholder="Enter text for QR code..."></textarea>
          </div>

          <div v-if="selectedType === 'url'" class="form-group">
            <label for="url">URL:</label>
            <input type="url" id="url" v-model="formData.url" placeholder="https://example.com">
          </div>

          <div v-if="selectedType === 'email'" class="form-group">
            <label for="email">Email Address:</label>
            <input type="email" id="email" v-model="formData.email" placeholder="example@email.com">
            <label for="emailSubject">Subject:</label>
            <input type="text" id="emailSubject" v-model="formData.emailSubject" placeholder="Email subject">
            <label for="emailBody">Message:</label>
            <textarea id="emailBody" v-model="formData.emailBody" rows="3" placeholder="Email content"></textarea>
          </div>

          <div v-if="selectedType === 'phone'" class="form-group">
            <label for="phone">Phone Number:</label>
            <input type="tel" id="phone" v-model="formData.phone" placeholder="+905551234567">
          </div>

          <div v-if="selectedType === 'sms'" class="form-group">
            <label for="smsPhone">Phone Number:</label>
            <input type="tel" id="smsPhone" v-model="formData.smsPhone" placeholder="+905551234567">
            <label for="smsMessage">SMS Message:</label>
            <textarea id="smsMessage" v-model="formData.smsMessage" rows="3" placeholder="SMS message content"></textarea>
          </div>

          <div v-if="selectedType === 'vcard'" class="form-group">
            <label for="vcardName">Full Name:</label>
            <input type="text" id="vcardName" v-model="formData.vcardName" placeholder="John Doe">
            <label for="vcardPhone">Phone:</label>
            <input type="tel" id="vcardPhone" v-model="formData.vcardPhone" placeholder="+905551234567">
            <label for="vcardEmail">Email:</label>
            <input type="email" id="vcardEmail" v-model="formData.vcardEmail" placeholder="john@doe.com">
            <label for="vcardAddress">Address:</label>
            <input type="text" id="vcardAddress" v-model="formData.vcardAddress" placeholder="Istanbul, Turkey">
            <label for="vcardCompany">Company:</label>
            <input type="text" id="vcardCompany" v-model="formData.vcardCompany" placeholder="ABC Company">
            <label for="vcardTitle">Title:</label>
            <input type="text" id="vcardTitle" v-model="formData.vcardTitle" placeholder="Software Developer">
          </div>

          <div v-if="selectedType === 'wifi'" class="form-group">
            <label for="wifiSsid">Network Name (SSID):</label>
            <input type="text" id="wifiSsid" v-model="formData.wifiSsid" placeholder="MyWiFi">
            <label for="wifiPassword">Password:</label>
            <input type="text" id="wifiPassword" v-model="formData.wifiPassword" placeholder="WiFi password">
            <label for="wifiEncryption">Encryption Type:</label>
            <select id="wifiEncryption" v-model="formData.wifiEncryption">
              <option value="WPA">WPA/WPA2</option>
              <option value="WEP">WEP</option>
              <option value="nopass">No Password</option>
            </select>
          </div>

          <div v-if="selectedType === 'location'" class="form-group">
            <label for="locationLat">Latitude:</label>
            <input type="number" id="locationLat" v-model="formData.locationLat" placeholder="41.0082" step="any">
            <label for="locationLng">Longitude:</label>
            <input type="number" id="locationLng" v-model="formData.locationLng" placeholder="28.9784" step="any">
            <label for="locationLabel">Location Label:</label>
            <input type="text" id="locationLabel" v-model="formData.locationLabel" placeholder="Istanbul">
          </div>

          <div v-if="selectedType === 'event'" class="form-group">
            <label for="eventTitle">Event Name:</label>
            <input type="text" id="eventTitle" v-model="formData.eventTitle" placeholder="Meeting">
            <label for="eventDescription">Description:</label>
            <textarea id="eventDescription" v-model="formData.eventDescription" rows="3" placeholder="Event description"></textarea>
            <label for="eventDate">Date:</label>
            <input type="date" id="eventDate" v-model="formData.eventDate">
            <label for="eventTime">Time:</label>
            <input type="time" id="eventTime" v-model="formData.eventTime">
            <label for="eventLocation">Location:</label>
            <input type="text" id="eventLocation" v-model="formData.eventLocation" placeholder="Meeting room">
          </div>

          <div v-if="selectedType === 'payment'" class="form-group">
            <label for="paymentType">Payment Type:</label>
            <select id="paymentType" v-model="formData.paymentType">
              <option value="paypal">PayPal</option>
              <option value="bitcoin">Bitcoin</option>
              <option value="ethereum">Ethereum</option>
              <option value="other">Other</option>
            </select>
            <label for="paymentAddress">Wallet Address / Payment Link:</label>
            <input type="text" id="paymentAddress" v-model="formData.paymentAddress" placeholder="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa">
            <label for="paymentAmount">Amount:</label>
            <input type="number" id="paymentAmount" v-model="formData.paymentAmount" placeholder="0.00" step="0.01">
            <label for="paymentCurrency">Currency:</label>
            <input type="text" id="paymentCurrency" v-model="formData.paymentCurrency" placeholder="USD, BTC, ETH">
          </div>

          <div class="button-group">
            <button @click="generateQRCode" :disabled="!isFormValid" class="generate-btn">
              Generate QR Code
            </button>
            <button @click="resetForm" class="reset-btn">
              Clear Form
            </button>
          </div>
        </div>

        <div v-if="qrCodeData" class="preview-container">
          <h2>QR Code Preview</h2>
          <div class="qr-preview">
            <img :src="qrCodeData" alt="QR Code">
          </div>
          <div class="preview-buttons">
            <button @click="downloadQRCode" class="download-btn">
              Download QR Code
            </button>
            <a :href="qrCodeData" download="qrcode.png" class="hidden-download" ref="downloadLink"></a>
          </div>
        </div>

        <!-- <div class="kit-footer">
          <p>QR Code Generator Plus - Created by <a href="https://www.github.com/ismailoksuz" target="_blank">İsmail ÖKSÜZ</a></p>
        </div> -->
      </div>
    </main>

    <!-- <footer>
      <p>Created by <a href="https://www.github.com/ismailoksuz" target="_blank">İsmail ÖKSÜZ</a></p>
    </footer> -->
  </div>
</template>

<script>
import QRCode from 'qrcode'

export default {
  name: 'App',
  data() {
    return {
      selectedType: '',
      formData: {
        text: '',
        url: '',
        email: '',
        emailSubject: '',
        emailBody: '',
        phone: '',
        smsPhone: '',
        smsMessage: '',
        vcardName: '',
        vcardPhone: '',
        vcardEmail: '',
        vcardAddress: '',
        vcardCompany: '',
        vcardTitle: '',
        wifiSsid: '',
        wifiPassword: '',
        wifiEncryption: 'WPA',
        locationLat: '',
        locationLng: '',
        locationLabel: '',
        eventTitle: '',
        eventDescription: '',
        eventDate: '',
        eventTime: '',
        eventLocation: '',
        paymentType: 'paypal',
        paymentAddress: '',
        paymentAmount: '',
        paymentCurrency: 'USD'
      },
      qrCodeData: null
    }
  },
  computed: {
    isFormValid() {
      if (!this.selectedType) return false

      switch (this.selectedType) {
        case 'text':
          return this.formData.text.trim() !== ''
        case 'url':
          return this.formData.url.trim() !== ''
        case 'email':
          return this.formData.email.trim() !== ''
        case 'phone':
          return this.formData.phone.trim() !== ''
        case 'sms':
          return this.formData.smsPhone.trim() !== '' && this.formData.smsMessage.trim() !== ''
        case 'vcard':
          return this.formData.vcardName.trim() !== '' || this.formData.vcardPhone.trim() !== '' || this.formData.vcardEmail.trim() !== ''
        case 'wifi':
          return this.formData.wifiSsid.trim() !== ''
        case 'location':
          return this.formData.locationLat && this.formData.locationLng
        case 'event':
          return this.formData.eventTitle.trim() !== '' && this.formData.eventDate.trim() !== ''
        case 'payment':
          return this.formData.paymentAddress.trim() !== ''
        default:
          return false
      }
    }
  },
  methods: {
    getTypeTitle() {
      const titles = {
        text: 'Text QR Code',
        url: 'URL QR Code',
        email: 'Email QR Code',
        phone: 'Phone QR Code',
        sms: 'SMS QR Code',
        vcard: 'V-Card QR Code',
        wifi: 'Wi-Fi QR Code',
        location: 'Location QR Code',
        event: 'Event QR Code',
        payment: 'Payment QR Code'
      }
      return titles[this.selectedType] || 'Generate QR Code'
    },
    
    generateQRCode() {
      let qrContent = ''

      switch (this.selectedType) {
        case 'text':
          qrContent = this.formData.text
          break
        case 'url':
          qrContent = this.formData.url.startsWith('http') ? this.formData.url : `https://${this.formData.url}`
          break
        case 'email':
          qrContent = `mailto:${this.formData.email}`
          if (this.formData.emailSubject) qrContent += `?subject=${encodeURIComponent(this.formData.emailSubject)}`
          if (this.formData.emailBody) qrContent += `${this.formData.emailSubject ? '&' : '?'}body=${encodeURIComponent(this.formData.emailBody)}`
          break
        case 'phone':
          qrContent = `tel:${this.formData.phone}`
          break
        case 'sms':
          qrContent = `sms:${this.formData.smsPhone}${this.formData.smsMessage ? `?body=${encodeURIComponent(this.formData.smsMessage)}` : ''}`
          break
        case 'vcard':
          qrContent = 'BEGIN:VCARD\nVERSION:3.0\n'
          if (this.formData.vcardName) qrContent += `FN:${this.formData.vcardName}\n`
          if (this.formData.vcardPhone) qrContent += `TEL:${this.formData.vcardPhone}\n`
          if (this.formData.vcardEmail) qrContent += `EMAIL:${this.formData.vcardEmail}\n`
          if (this.formData.vcardAddress) qrContent += `ADR:${this.formData.vcardAddress}\n`
          if (this.formData.vcardCompany) qrContent += `ORG:${this.formData.vcardCompany}\n`
          if (this.formData.vcardTitle) qrContent += `TITLE:${this.formData.vcardTitle}\n`
          qrContent += 'END:VCARD'
          break
        case 'wifi':
          qrContent = `WIFI:S:${this.formData.wifiSsid};T:${this.formData.wifiEncryption};P:${this.formData.wifiPassword};;`
          break
        case 'location':
          qrContent = `geo:${this.formData.locationLat},${this.formData.locationLng}${this.formData.locationLabel ? `?q=${encodeURIComponent(this.formData.locationLabel)}` : ''}`
          break
        case 'event':
          let dateTime = ''
          if (this.formData.eventDate && this.formData.eventTime) {
            const date = new Date(`${this.formData.eventDate}T${this.formData.eventTime}`)
            dateTime = date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
          }
          qrContent = 'BEGIN:VEVENT\n'
          qrContent += `SUMMARY:${this.formData.eventTitle}\n`
          if (this.formData.eventDescription) qrContent += `DESCRIPTION:${this.formData.eventDescription}\n`
          if (dateTime) qrContent += `DTSTART:${dateTime}\n`
          if (this.formData.eventLocation) qrContent += `LOCATION:${this.formData.eventLocation}\n`
          qrContent += 'END:VEVENT'
          break
        case 'payment':
          const currency = this.formData.paymentCurrency || 'USD'
          const amount = this.formData.paymentAmount ? `?amount=${this.formData.paymentAmount}` : ''
          switch (this.formData.paymentType) {
            case 'paypal':
              qrContent = `https://paypal.me/${this.formData.paymentAddress}${amount}`
              break
            case 'bitcoin':
              qrContent = `bitcoin:${this.formData.paymentAddress}${amount}`
              break
            case 'ethereum':
              qrContent = `ethereum:${this.formData.paymentAddress}${amount}`
              break
            default:
              qrContent = this.formData.paymentAddress
          }
          break
      }

      QRCode.toDataURL(qrContent, { errorCorrectionLevel: 'H' })
        .then(url => {
          this.qrCodeData = url
        })
        .catch(err => {
          console.error('QR Code generation error:', err)
          alert('An error occurred while generating QR code.')
        })
    },

    downloadQRCode() {
      if (this.qrCodeData) {
        this.$refs.downloadLink.click()
      }
    },

    resetForm() {
      Object.keys(this.formData).forEach(key => {
        if (key === 'wifiEncryption') {
          this.formData[key] = 'WPA'
        } else if (key === 'paymentType') {
          this.formData[key] = 'paypal'
        } else if (key === 'paymentCurrency') {
          this.formData[key] = 'USD'
        } else {
          this.formData[key] = ''
        }
      })
      this.qrCodeData = null
    }
  }
}
</script>