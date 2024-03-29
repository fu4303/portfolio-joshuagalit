import moment from 'moment'
import { motion } from 'framer-motion'
import { Menu } from '@headlessui/react'
import { ThreeDotIcon } from '~/utils/Icons'
import { useToasts } from 'react-toast-notifications'
import { hasuraAdminClient } from '~/lib/hasura-admin-client'
import { DELETE_PROJECT_COMMENT_BY_ID_MUTATION } from '~/graphql/mutations'

export default function ProjectCommentList ({ mutate, projects }) {
  const { comments } = projects[0]
  return comments.map((comment, i) => <ProjectCommentItem key={i} {...comment } mutate={mutate} />)
}

function ProjectCommentItem ({ id, name, comment, created_at, mutate }) {
  const { addToast } = useToasts()

  const handleDeleteComment = async () => {

    let isDelete = prompt('Confirm password to delete post!', '')
    if (isDelete === process.env.ADMINISTRATOR_PASS) {
      const { delete_project_comments: { returning: { ...project } } } = await hasuraAdminClient.request(DELETE_PROJECT_COMMENT_BY_ID_MUTATION, { id })

      mutate({
        projects: [{
          ...project[0].project
        }]
      })
      addToast('Comment Successfully Deleted!', { appearance: 'success', autoDismiss: true })
    } else if (isDelete === '' || isDelete === null) {
      addToast('Please input admin password to delete this post!', { appearance: 'warning', autoDismiss: true })
    } else {
      addToast('You are unauthorized to delete the comment posted!', { appearance: 'error', autoDismiss: true })
    }
  }

  return (
    <div key={id} className="flex space-x-3 py-3 px-2">
      <Avatar name={name} className="w-9 h-9 rounded-full" />
      <div className="flex flex-col -my-1.5 rounded-xl px-4 py-3 bg-gray-100 dark:bg-gray-800 w-full transition ease-in-out duration-700">
        {/* Comment Header section */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
            <h1 className="font-semibold text-gray-700 dark:text-gray-200 transition ease-in-out duration-700 line-clamp-1 capitalize">{ name }</h1>
            <span>&bull;</span>
            <span className="text-xs line-clamp-1">
              { moment(created_at).fromNow() }
            </span>
          </div>
          <DropdownMenu 
            handleDeleteComment={handleDeleteComment}
          />
        </div>
        {/* Actual comments */}
        <div>
          <p className="text-sm tracking-wide text-gray-600 dark:text-white">
            { comment }
          </p>
        </div>
      </div>
    </div>
  )
}

function Avatar ({ className, name }) {
  return (
    <div className="flex-shrink-0">
      <img 
        className={className} 
        src={ 
          name === 'Joshua Galit' 
          ? '/images/my-avatar.jpg' 
          : '/images/default-avatar.jpg' } 
      />
    </div>
  )
}

function DropdownMenu ({ handleDeleteComment }) {
  return (
    <div className="relative">
      <Menu>
        {({ open }) => (
          <>
            <Menu.Button className="text-gray-500 focus:outline-none">
              <ThreeDotIcon className="w-5 h-5" />
            </Menu.Button>
            { open && (
              <Menu.Items 
                as={motion.div}
                static
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                transition={{ duration: 0.25 }}
                className="absolute right-0 top-0 flex flex-col z-50 overflow-hidden divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800 outline-none border dark:border-gray-700 rounded-lg shadow-lg"
              >
                <Menu.Item>
                  <button
                    onClick={handleDeleteComment}
                    className="text-sm px-4 py-1 text-gray-600 dark:text-gray-400 focus:outline-none hover:bg-gray-100 dark:hover:bg-gray-900 transition ease-in-out duration-200"
                  >
                    Report
                  </button>
                </Menu.Item>
                <Menu.Item>
                  <button 
                    onClick={e => e.preventDefault()}
                    className="text-sm px-4 py-1 text-gray-600 dark:text-gray-400 focus:outline-none hover:bg-gray-100 dark:hover:bg-gray-900 transition ease-in-out duration-200"
                  >
                    Cancel
                  </button>
                </Menu.Item>
              </Menu.Items>
            )}
          </>
        )}
      </Menu>
    </div>
  )
}