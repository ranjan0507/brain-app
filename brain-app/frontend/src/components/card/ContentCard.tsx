import { Card,CardContent } from "../ui/card";
import YoutubePreview from "./previews/Youtube.tsx";
import TweetPreview from "./previews/Tweet.tsx";
import LinkPreview from "./previews/Link.tsx";
import ImagePreview from "./previews/Image.tsx";

type ContentType = 'tweet'|'youtube'|'image'|'link' ;

interface CardProps{
	title : string 
	imageUrl? : string
	link? : string
	contentType : ContentType
}

export default function ContentCard(props : CardProps){
	const renderPreview = () => {
	  switch (props.contentType) {
      case "youtube":
        return <YoutubePreview url={props.link!} />;
      case "tweet":
        return <TweetPreview url={props.link!} />;
      case "image":
        return <ImagePreview url={props.imageUrl!} />;
      case "link":
      default:
        return <LinkPreview url={props.link!} />;
      }
	}
	return(
		<Card className="w-full shadow-md max-w-md rounded-2xl border-2">
			<CardContent className="p-4 space-y-2 min-h-72">
				<h2 className="text-xl font-semibold">{props.title}</h2>
				{renderPreview()}
			</CardContent>
		</Card>
	)
}