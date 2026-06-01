from moviepy import VideoFileClip
from moviepy import AudioFileClip


def merge_audio_video(
    video_path,
    audio_path,
    output_path
):

    video = VideoFileClip(video_path)

    audio = AudioFileClip(audio_path)

    if audio.duration > video.duration:

        audio = audio.subclipped(
            0,
            video.duration
        )

    final_video = video.with_audio(audio)

    final_video.write_videofile(
        output_path,
        codec="libx264",
        audio_codec="aac"
    )