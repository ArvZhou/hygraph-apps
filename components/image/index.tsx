import { useState, DetailedHTMLProps, ImgHTMLAttributes, useEffect } from "react"

const Image = ({error, ...rest}: DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> & {error: JSX.Element}) => {
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        setIsError(false);
    }, [rest.src])

    if (isError) {
        return error
    }

    return (
        <img {...rest} onError={() => setIsError(true)} />
    )
}

export default Image