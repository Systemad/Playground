import { useEffect } from 'react';

import { GameSummary, lobbySplitApi } from '../../../features/lobby/lobbyAPI';
import { useAppDispatch } from '../../../providers/store';
import connection from "./Socket"

enum LobbyActions
{
    AddGame = "AddGame",
    RemoveGame = "RemoveGame",
    EditGame = "EditGame"
}

export function UseLobbySocket(): void {
  const dispatch = useAppDispatch();

  useEffect((): any => {
    connection.on(LobbyActions.AddGame, (game: GameSummary) => {
      const patchCollection = dispatch(
        lobbySplitApi.util.updateQueryData("lobbyGetGames", undefined, (draftLobbies) => {
          draftLobbies.push(game);
        })
      )
    })

    connection.on(LobbyActions.RemoveGame, (gameId: string) => {
      const patchCollection = dispatch(
        lobbySplitApi.util.updateQueryData('lobbyGetGames', undefined, (draft) => {
          draft.filter((l) => l.id !== gameId);
        })
      )
    });

    connection.on(LobbyActions.EditGame, (game: GameSummary) => {
      const patchCollection = dispatch(
        lobbySplitApi.util.updateQueryData('lobbyGetGames', undefined, (draftLobbies) => {
          let gameIndex = draftLobbies.findIndex((l) => l.id === game.id);
          draftLobbies[gameIndex] = game;
        })
      )
    });
  }, [connection])
}