import { useEffect, useState } from 'react';

import { useAppDispatch } from '../../../providers/store';
import connection from "../../../utils/api/signalr/Socket"
import { lobbySplitApi } from '../../lobby/lobbyAPI';
import { Player, quizSplitApi } from '../quizAPI';
import { Root } from '../Question';

enum QuizEvents
{
    PlayerAdded = "PlayerAdded",
    PlayerRemoved = "PlayerRemoved",

    StartGame = "StartGame",
    EndGame = "EndGame",
    NextQuestion = "NextQuestion",
}

export function UseQuizSocket(gameId: string): void {
  const dispatch = useAppDispatch();
  const [currentQuestion, setCurrentQuestion] = useState({});
  const [gameActive, setGameActive] = useState(false);

  useEffect((): any => {
    connection.on(QuizEvents.PlayerAdded, (player: Player) => {

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

    connection.on(QuizEvents.PlayerRemoved, (playerId: string) => {
      const patchCollection = dispatch(
        quizSplitApi.util.updateQueryData('quizGetGameRuntime', {gameId: gameId}, (draft) => {
          let player = draft.players?.filter(p => p.id == playerId);
          if(draft.players && player)
            draft.players.filter(p => p.id == playerId);
        })
      )
    })
    connection.on(QuizEvents.StartGame, (question: Root) => {
      if(question){
        setCurrentQuestion(question);
        setGameActive(true);
      }
    })

    connection.on(QuizEvents.EndGame, () => {
      setGameActive(false);
      setCurrentQuestion({});
    })
    connection.on(QuizEvents.NextQuestion, (question: Root) => {
      const patchCollection = dispatch(
        quizSplitApi.util.updateQueryData('quizGetGameRuntime', {gameId: gameId}, (draft) => {
          if(draft.questionStep)
            draft.questionStep++;
        })
      )
      if(question)
        setCurrentQuestion(question);

    })
  }, [connection])
}