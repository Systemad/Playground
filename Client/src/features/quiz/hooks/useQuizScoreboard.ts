import { useEffect, useState } from 'react';

import { useAppDispatch } from '../../../providers/store';
import connection from "../../../utils/api/signalr/Socket"
import { Player, quizSplitApi } from '../api/quizAPI';
import { Root } from '../Question';

enum ScoreboardEvents
{
    UpdateScoreboard = "UpdateScoreboard",
}

export function UseQuizScoreboard(gameId: string): void {
  const dispatch = useAppDispatch();

  //const [currentQuestion, setCurrentQuestion] = useState({});
  //const [gameActive, setGameActive] = useState(false);

  useEffect((): any => {
    connection.on(ScoreboardEvents.UpdateScoreboard, (player: Player) => {

      // TODO:
      // Get Index of of game with gameid, then just update
      // const index = draft.findinedex(x=x.id == gameid);
      // index = index.Players.filter(x = x.playerId == playerId from socket);
      const patchCollection = dispatch(
        quizSplitApi.util.updateQueryData('quizGetGameRuntime', {gameId: gameId}, (draft) => {
          let newplayer = draft.players?.filter(p => p.id == player.id);
          if(!newplayer)
            draft.players?.push(player);
        })
      )
    })
  }, [connection])
}