var _a;
import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'node:fs';
const engineId = 'stable-diffusion-512-v2-1';
const apiHost = (_a = process.env.API_HOST) !== null && _a !== void 0 ? _a : 'https://api.stability.ai';
const apiKey = "sk-TGsTOx6oaNFY95INbcDbr166veumaOjC60T73FtpJwhUbRP6";
if (!apiKey)
    throw new Error('Missing Stability API key.');
// NOTE: This example is using a NodeJS FormData library. Browser
// implementations should use their native FormData class. React Native
// implementations should also use their native FormData class.
const formData = new FormData();
formData.append('init_image', fs.readFileSync('./in/imagen.png'));
formData.append('mask_image', fs.readFileSync('./in/mask.png'));
formData.append('mask_source', 'MASK_IMAGE_BLACK');
formData.append('text_prompts[0][text]', 'A realistic image of a model wearing a gucci shirt and blazer');
formData.append('cfg_scale', '7');
formData.append('clip_guidance_preset', 'FAST_BLUE');
formData.append('samples', 1);
formData.append('steps', 30);
const response = await fetch(`${apiHost}/v1/generation/${engineId}/image-to-image/masking`, {
    method: 'POST',
    headers: Object.assign(Object.assign({}, formData.getHeaders()), { Accept: 'application/json', Authorization: `Bearer ${apiKey}` }),
    body: formData,
});
if (!response.ok) {
    throw new Error(`Non-200 response: ${await response.text()}`);
}
const responseJSON = (await response.json());
responseJSON.artifacts.forEach((image, index) => {
    fs.writeFileSync(`out/v1_img2img_masking_${index}.png`, Buffer.from(image.base64, 'base64'));
});
