const CONVERTER_URL = "/convert/itunes";

export class PlaylistConverter {
  fromITunesXML(file: File) {
    const formData = new FormData();
    formData.append("name", file.name);
    formData.append("file", file);
    return fetch(CONVERTER_URL, {
      method: "POST",
      body: formData,
    }).then((data) => data.json());
  }
}
