/**
 * @typedef {import('./types').Message} Message
 * @typedef {import('./types').Data} Data
 */

const fs = require('fs')
const path = require('path')

const inputDir = path.join(__dirname, 'archive')
const outputFile = path.join(__dirname, 'messages.csv')

const COMPONENTS_FOR_INITIAL_AND_VARIATION = new Set(
    ['U1', 'U2', 'U3', 'U4', '⟳', 'V1', 'V2', 'V3', 'V4']
)

const COMPONENTS_FOR_UPSCALE = new Set(
    ['Make Variations', 'Upscale to Max', 'Light Upscale Redo']
)

fs.readdir(inputDir, (err, files) => {
    if (err)
        throw new Error(`Error reading directory: ${err}`)

    const parsed = files.map(file => {
        const filePath = path.join(inputDir, file)

        /** @type {Data} */
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

        return data.messages.map(messages => ({
            type: getMessageType(messages[0]),
            prompt: getPrompt(messages[0])
        }))
    })

    jsonToCsv(parsed.flat())
})

/**
 * 
 * @param {Message} message
 * @returns {'INCONCLUSIVE' |'INITIAL_OR_VARIATION' | 'UPSCALE' | 'TEXT_MESSAGE'}
 */
function getMessageType(message) {
    // Figures out the message type based on the UI components displayed.
    for (const components of message.components)
        for (const component of components.components) {
            if (COMPONENTS_FOR_INITIAL_AND_VARIATION.has(component.label)) {
                /* 
                    For (very few) messages that are supposedly initial or variation requests, the content indicates
                    that they are actually upscale requests. We will just put these aside.
                */
                if (message.content.includes('Upscaled'))
                    return 'INCONCLUSIVE'

                return 'INITIAL_OR_VARIATION'
            }
            
            if (COMPONENTS_FOR_UPSCALE.has(component.label))
                return 'UPSCALE'

        }

    return 'TEXT_MESSAGE'
}

/**
 * 
 * @param {Message} message
 */
function getPrompt(message) {
    const prompt = ''
    const content = message.content.replace('\n', ' ')

    //  Find the text enclosed by two consecutive stars.
    BETWEEN_STARS = /\*\*(.*?)\*\*/g

    const match = content.match(BETWEEN_STARS)

    if (match)
        return match[0].replaceAll('**', '')
}

/**
 * 
 * @param {Array<any>} items
 */
function jsonToCsv(items) {
    const header = Object.keys(items[0])

    const headerString = header.join(',')

    // handle null or undefined values here
    const replacer = (key, value) => value ?? ''

    const rowItems = items.map((row) =>
        header
        .map((fieldName) => JSON.stringify(row[fieldName], replacer))
        .join(';')
    )

    // join header and body, and break into separate lines
    const csv = [headerString, ...rowItems].join('\r\n')

    fs.writeFileSync(outputFile, csv)
}
  