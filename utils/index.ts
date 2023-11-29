export function isImageFile(name: string) {
    return (/\.(jpg|jpeg|png|gif|svg)$/i).test(name);
}