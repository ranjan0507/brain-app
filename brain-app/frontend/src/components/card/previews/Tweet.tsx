interface TweetPreviewProps{
	url : string
}

export default function TweetPreview({url} : TweetPreviewProps){
	function normalizeTweetUrl(url: string): string {
  		return url.replace("x", "twitter");
	}
	return (
    <blockquote className="twitter-tweet">
      <a href={normalizeTweetUrl(url)}></a>
    </blockquote>
  	);
}