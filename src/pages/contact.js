import Head from 'next/head'
import { motion } from 'framer-motion'
import Layout from '~/layouts/default'
import { contacts } from '~/constants/contacts'
import ContactForm from '~/components/ContactForm'
import { useToasts } from 'react-toast-notifications'
import { INSERT_MAIL_MUTATION } from '~/graphql/mutations'
import { hasuraAdminClient } from '~/lib/hasura-admin-client'

export default function ContactPage() {

  const { addToast } = useToasts()

  const handleContact = async ({ name, email, message }, e) => {
    try {

      await hasuraAdminClient.request(INSERT_MAIL_MUTATION, {
        name,
        email,
        message
      })

      e.target.reset()
      addToast('Your message successfully sent!', { appearance: 'success', autoDismiss: true })
      
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      <Head>
        <title>Contact | Joshua Galit</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="w-full max-w-5xl m-auto px-4 py-4">
          <div className="w-full h-full opacity-30">
            <img src="/svgs/buble.svg" disabled className="absolute inset-0 w-full h-full" />
          </div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-8"
          >
            <div className="flex flex-col space-y-10 md:space-y-20">
              <div className="flex flex-col space-y-5 md:space-y-8 w-full max-w-md z-50">
                <h1 className="font-extrabold text-3xl md:text-5xl text-blue-twitter">Contact me</h1>
                <p className="text-base text-gray-900 dark:text-white">Send me a message and I will get back to you within 24 hours.</p>
              </div>
              <div className="flex flex-col space-y-3 md:space-y-5 z-50">
                {contacts.map(({ icon, text }, i) => (
                  <div key={i} className="flex items-center space-x-6 text-gray-900 dark:text-white">
                    <span className="text-blue-twitter">
                      { icon }
                    </span>
                    <p className="text-base">{ text }</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-lg w-full max-w-full md:max-w-lg px-8 py-10 bg-white shadow-md dark:bg-gray-900 z-50">
              <div className="relative w-full">
                <ContactForm onSubmit={ handleContact } />
              </div>
            </div>
          </motion.div>
        </div>
      </Layout>
    </> 
  )
}