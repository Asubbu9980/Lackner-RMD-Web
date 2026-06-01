import edge_tts


async def generate_voice(
    text,
    output_file
):

    communicate = edge_tts.Communicate(
        text,
        voice="en-US-AndrewNeural",
        rate="+25%"
    )

    await communicate.save(output_file)