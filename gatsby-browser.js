/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// lazy loading
import 'lazysizes'

export const registerServiceWorker = () => true

export const onServiceWorkerUpdateReady = () => {
  const answer = window.confirm(
    `This application has been updated. ` +
    `Reload to display the latest version?`
  )

  if (answer === true) {
    window.location.reload()
  }
}

export const onServiceWorkerUpdateFound = () => {
  const showNotification = () => {
    Notification.requestPermission(result => {
      if (result === 'granted') {
        navigator.serviceWorker.ready.then(registration => {
          registration.showNotification('Update', {
            body: 'New content is available!',
            icon: 'link-to-your-icon',
            vibrate: [200, 100, 200, 100, 200, 100, 400],
            tag: 'request',
            actions: [ // you can customize these actions as you like
              {
                action: console.log('update push'), // you should define this
                title: 'update'
              },
              {
                action: console.log('ignore push'), // you should define this
                title: 'ignore'
              }
            ]
          })
        })
      }
    })
  }

  showNotification()
}