import clone from 'clone';
import { ReplicantBrowser } from 'nodecg/types/browser'; // eslint-disable-line import/no-unresolved
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { DefaultSetupTime, HoraroImportSavedOpts, HoraroImportStatus, OengusImportStatus, RunDataActiveRunSurrounding, RunFinishTimes, TimerChangesDisabled, TwitchAPIData, TwitchChannelInfo, TwitchCommercialTimer } from '../../../schemas'; // eslint-disable-line max-len, object-curly-newline
import { RunDataActiveRun, RunDataArray, Timer } from '../../../types';

Vue.use(Vuex);

const replicantNames = [
  'runDataArray',
  'runDataActiveRun',
  'runDataActiveRunSurrounding',
  'runFinishTimes',
  'horaroImportStatus',
  'horaroImportSavedOpts',
  'oengusImportStatus',
  'defaultSetupTime',
  'timer',
  'timerChangesDisabled',
  'twitchAPIData',
  'twitchChannelInfo',
  'twitchCommercialTimer',
];
const replicants: ReplicantBrowser<unknown>[] = [];

export const store = new Vuex.Store({
  state: {
    runDataArray: [] as RunDataArray,
    runDataActiveRun: undefined as RunDataActiveRun,
    runDataActiveRunSurrounding: {} as RunDataActiveRunSurrounding,
    runFinishTimes: {} as RunFinishTimes,
    horaroImportStatus: {} as HoraroImportStatus,
    horaroImportSavedOpts: null as HoraroImportSavedOpts,
    oengusImportStatus: {} as OengusImportStatus,
    defaultSetupTime: 0 as DefaultSetupTime,
    timer: {} as Timer,
    timerChangesDisabled: false as TimerChangesDisabled,
    twitchAPIData: {} as TwitchAPIData,
    twitchChannelInfo: {} as TwitchChannelInfo,
    twitchCommercialTimer: {} as TwitchCommercialTimer,
  },
  mutations: {
    updateReplicant(state, { name, value }): void {
      Vue.set(state, name, value);
    },
    updateActiveRunTeamOrder(state, { value }): void {
      const rep = replicants.find((repObj) => repObj.name === 'runDataActiveRun');
      if (state.runDataActiveRun && rep && rep.value) {
        Vue.set(state.runDataActiveRun, 'teams', value);
        rep.value = state.runDataActiveRun;
      }
    },
    updateRunOrder(state, { value }): void {
      const rep = replicants.find((repObj) => repObj.name === 'runDataArray');
      if (state.runDataArray && rep && rep.value) {
        Vue.set(state, 'runDataArray', value);
        rep.value = state.runDataArray;
      }
    },
    updateTwitchSyncToggle(state, { value }): void {
      const rep = replicants.find(
        (repObj) => repObj.name === 'twitchAPIData',
      ) as ReplicantBrowser<TwitchAPIData>;
      if (rep.value) {
        Vue.set(state.twitchAPIData, 'sync', value);
        rep.value.sync = value;
      }
    },
    updateTimerDisabledToggle(state, { value }): void {
      const rep = replicants.find(
        (repObj) => repObj.name === 'timerChangesDisabled',
      ) as ReplicantBrowser<TimerChangesDisabled>;
      if (typeof rep.value === 'boolean') {
        Vue.set(state, 'timerChangesDisabled', value);
        rep.value = value;
      }
    },
    saveHoraroImportOpts(state, { value }): void {
      const rep = replicants.find(
        (repObj) => repObj.name === 'horaroImportSavedOpts',
      ) as ReplicantBrowser<HoraroImportSavedOpts>;
      Vue.set(state, 'horaroImportSavedOpts', value);
      rep.value = value;
    },
  },
});

replicantNames.forEach((name) => {
  const replicant = nodecg.Replicant(name);

  replicant.on('change', (newVal) => {
    store.commit('updateReplicant', {
      name: replicant.name,
      value: clone(newVal),
    });
  });

  replicants.push(replicant);
});

export async function create(): Promise<Store<{
  runDataArray: RunDataArray;
  runDataActiveRun: RunDataActiveRun;
  runDataActiveRunSurrounding: RunDataActiveRunSurrounding;
  runFinishTimes: RunFinishTimes;
  horaroImportStatus: HoraroImportStatus;
  horaroImportSavedOpts: HoraroImportSavedOpts;
  oengusImportStatus: OengusImportStatus;
  defaultSetupTime: DefaultSetupTime;
  timer: Timer;
  timerChangesDisabled: TimerChangesDisabled;
  twitchAPIData: TwitchAPIData;
  twitchChannelInfo: TwitchChannelInfo;
  twitchCommercialTimer: TwitchCommercialTimer;
}>> {
  return NodeCG.waitForReplicants(...replicants).then(() => store);
}
