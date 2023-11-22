import { useState, DetailedHTMLProps, ImgHTMLAttributes } from "react"

const Image = ({error, ...rest}: DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> & {error: JSX.Element}) => {
    const [isError, setIsError] = useState(false);

    if (isError) {
        return error
    }

    return (
        <img {...rest} onError={() => setIsError(true)} />
    )
}

export default Image