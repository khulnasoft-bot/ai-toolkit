export function convertBase64ToUint8Array(base64String) {
    const base64Url = base64String.replace(/-/g, '+').replace(/_/g, '/');
    const latin1string = atob(base64Url);
    return Uint8Array.from(latin1string, byte => byte.codePointAt(0));
}
//# sourceMappingURL=convert-base64.js.map