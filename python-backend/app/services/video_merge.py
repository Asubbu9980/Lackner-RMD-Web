from moviepy import VideoFileClip
from moviepy import AudioFileClip
from moviepy import concatenate_videoclips


def merge_audio_video(
    video_path,
    audio_path,
    output_path
):

    video = VideoFileClip(video_path)

    audio = AudioFileClip(audio_path)

    if audio.duration > video.duration:

        # Narration is longer than the rendered animation (e.g. after the
        # end-of-scene wait() padding was trimmed in PERF-0003). Extend the
        # video by freezing on its last frame so the full narration plays
        # instead of being cut off. Do NOT truncate the audio here.
        last_frame_t = max(
            0,
            video.duration - (1.0 / video.fps)
        )

        freeze = (
            video
            .to_ImageClip(last_frame_t)
            .with_duration(
                audio.duration - video.duration
            )
        )

        video = concatenate_videoclips(
            [video, freeze]
        )

    final_video = video.with_audio(audio)

    final_video.write_videofile(
        output_path,
        codec="libx264",
        audio_codec="aac",
        preset="ultrafast"
    )