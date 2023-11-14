export interface Data {
    messages: Message[][]
}

export interface Message {
    id: string
    type: number
    content: string
    channel_id: string
    author: {
        id: string
        username: string
        avatar: string
        avatar_decoration: string | null
        discriminator: string
        public_flags: number
        bot: boolean
    }
    attachments: {
        id: string
        filename: string
        size: number
        url: string
        proxy_url: string
        width: number
        height: number
        content_type: string
    }[]
    mentions: {
        id: string
        username: string
        avatar: string
        avatar_decoration: string | null
        discriminator: string
        public_flags: number
        bot?: boolean
    }[]
    pinned: boolean
    mention_everyone: boolean
    tts: boolean
    timestamp: string
    edited_timestamp: string | null
    flags: number
    components: {
        type: number
        components: {
            type: number
            style: number
            label: string
            custom_id: string
        }[]
    }[]
    message_reference: {
        channel_id: string
        guild_id: string
        message_id: string
    }
    hit: boolean
}