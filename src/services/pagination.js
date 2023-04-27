



export const pagination = ({ page = 1, size = 5 } = {}) => {
    if (page <= 0) page = 1
    if (size < 1) size = 5

    const perPage = parseInt(size)
    const currentPage = parseInt(page)
    const nextPage = parseInt(page) + 1
    const prePage = parseInt(page) - 1
    const skip = (parseInt(page) - 1) * parseInt(size)

    return {
        perPage,
        skip,
        prePage,
        nextPage,
        currentPage
    }
}