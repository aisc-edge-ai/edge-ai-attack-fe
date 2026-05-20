# CCTV motion loop assets

Place Sora-generated object-detection loops here using these fixed names:

- `cctv-detection-idle.mp4`
- `cctv-detection-hiding.mp4`
- `cctv-detection-altering.mp4`
- `cctv-detection-creating.mp4`

Optional WebM versions with the same basenames are preferred for smaller downloads.
The frontend never calls Sora at runtime; it only loads these static assets.
In production the app is served under `/edge-ai`, so these files should resolve
as `/edge-ai/animations/<filename>`.
