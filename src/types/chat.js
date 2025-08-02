// Type definitions for reference (JSDoc comments)

/**
 * @typedef {Object} FileAttachment
 * @property {string} id
 * @property {string} name
 * @property {number} size
 * @property {string} type
 * @property {string} url
 */

/**
 * @typedef {Object} Message
 * @property {string} id
 * @property {string} content
 * @property {'user' | 'assistant'} sender
 * @property {Date} timestamp
 * @property {FileAttachment[]} [attachments]
 */

/**
 * @typedef {Object} ChatState
 * @property {Message[]} messages
 * @property {boolean} isTyping
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string} name
 * @property {string} [avatar]
 * @property {string} [profileImage]
 */

export {};