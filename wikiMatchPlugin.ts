import pipe from "./.pd/regexPlugin/index.esm.js"

export const Plugin = (userOptions={
    stripExtension: false,
    regex: false,
}) => async (mdi, options) => {
    options = Object.assign({}, options || {}, userOptions)

    await pipe.process({mdi, options})
}