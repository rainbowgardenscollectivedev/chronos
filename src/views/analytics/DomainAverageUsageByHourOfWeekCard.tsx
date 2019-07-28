import React from "react";
import { connect } from "react-redux";

import Card from "../../components/Card";
import WeeklyHourHeatmap from "../../components/WeeklyHourHeatmap";
import selector from "../../store/selectors";
import { RootState } from "../../store/types";

interface DomainAverageUsageByHourOfWeekCardProps {
  data: {
    duration: number;
    hour: number;
    day: number;
  }[];
}

const MS_PER_MINUTE = 1000 * 60;
const THRESHOLDS = [0, 1, 15, 30, 45, 60].map(hours => hours * MS_PER_MINUTE);

const DomainAverageUsageByHourOfWeekCard = (
  props: DomainAverageUsageByHourOfWeekCardProps
) => (
  <Card
    className="analytics-view__card analytics-view__card--sm"
    title="Usage by Time of Day"
    description="Average time spent on each hour"
    body={
      <WeeklyHourHeatmap
        colorRange={["#f6f6f6", "#3D9CF4"]}
        data={props.data.map(d => ({
          day: d.day,
          hour: d.hour,
          value: d.duration
        }))}
        thresholds={THRESHOLDS}
      />
    }
  />
);

const mapStateToProps = (state: RootState) => ({
  data: selector.getSelectedDomainAverageDurationByHourOfWeek(state)
});

export default connect(mapStateToProps)(DomainAverageUsageByHourOfWeekCard);
