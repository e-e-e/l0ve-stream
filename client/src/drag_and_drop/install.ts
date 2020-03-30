import {ApolloClient, gql} from "apollo-boost";

const CREATE_PLAYLIST = gql`
  mutation createPlaylist($data: PlaylistInput) {
     createPlaylist(data: $data) {
         success
         message
         playlist {
             id
             title
             description
             tracks {
                 id
                 title
             }
         }
     } 
  }
`

export function install({
    url,
    apolloClient,
  }:
  {
    url: string,
    apolloClient: ApolloClient<unknown>,
  }) {
  const fileUpload = (file: File) => {
    let formData = new FormData();
    formData.append('name', file.name);
    formData.append('file', file);

    fetch(url, {
      method: 'POST',
      body: formData,
    })
      .then((data) => data.json())
      .then((data) => {
        console.log('recieved', data);
        return apolloClient.mutate({
          mutation: CREATE_PLAYLIST,
          variables: { data },
        })
      })
      .then((res) => {
        // res.data.createPlaylist;
        console.log()
        if (res.data.createPlaylist.success) {
          window.location.reload();
        } else {
          alert('failed - talk to siili about:\n' + res.data.createPlaylist.message)
        }

      })
      .catch((e) => {
        console.error(e);
      })
  }
  const preventDefault = (e: Event) => {
    e.preventDefault();
  }

  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((event) => {
    window.addEventListener(event, preventDefault);
  })
  window.addEventListener('dragenter', (e) => {
    console.log('enter');
  })
  window.addEventListener('dragleave', (e) => {
    console.log('leave');
  })
  window.addEventListener('dragend', (e) => {
    console.log('exit');
  })
  window.addEventListener('drop', (e) => {
    console.log(e.dataTransfer?.files);
    const files = e.dataTransfer?.files ?? [];
    for(let i = 0; i < files.length; i++) {
      fileUpload(files[i]);
    }
  })
}
