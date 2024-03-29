import Head from 'next/head'
import { motion } from 'framer-motion'
import Layout from '~/layouts/default'
import BlogList from '~/components/BlogList'
import { getAllPosts } from '~/utils/blogFiles'
import BlogHeader from '~/components/BlogHeader'

export async function getStaticProps() {
  const allPosts = getAllPosts();
  return {
    props: {
      posts: allPosts.map(({ data, content, slug }) => ({
        ...data,
        content,
        slug
      }))
    }
  }
}

export default function BlogPage ({ posts }) {
  return (
    <>
      <Head>
        <title>Blog | Joshua Galit</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="w-full max-w-5xl mx-auto px-4"
        >
          <BlogHeader />
          <div className="py-2 divide-y divide-gray-200 dark:divide-gray-700">
            <BlogList blogs={posts} />
          </div>
        </motion.div>
      </Layout>
    </>
  )
}