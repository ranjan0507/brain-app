interface YoutubePreviewProps {
	url : string
}

export default function YoutubePreview({url} : YoutubePreviewProps){
	function normalizeYoutubeUrl(url: string): string {
  		return url.replace("watch", "embed");
	}

	return(
		<div className="w-full aspect-video rounded-xl overflow-hidden">
				<iframe
					src={normalizeYoutubeUrl(url)}
					allowFullScreen
					className="w-full h-full"
				/>
		</div>
	)
}