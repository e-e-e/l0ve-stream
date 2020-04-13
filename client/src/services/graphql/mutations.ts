// import { gql, ApolloClient } from "apollo-boost";

export interface GraphMutationsService {
  deletePlaylist(): void;
}
//
// export class GraphMutationsClient implements GraphMutationsService {
//   constructor(private readonly client: ApolloClient<unknown>) {}
//
//   async playlist(id: string) {
//     const { data } = await this.client.query({
//       query: FETCH_PLAYLIST,
//       variables: {
//         id,
//       },
//     });
//     return data;
//   }
// }
