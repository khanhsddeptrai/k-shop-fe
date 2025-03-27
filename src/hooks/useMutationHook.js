import { useMutation } from "@tanstack/react-query"

export const useMutationHook = (fcCallback) => {
    const mutation = useMutation({
        mutationFn: fcCallback
    })
    return mutation;
}