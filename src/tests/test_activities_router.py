from pathlib import Path
import sys
import unittest
from unittest.mock import patch

from fastapi import HTTPException

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from backend.routers import activities


class FakeActivitiesCollection:
    def __init__(self, documents):
        self.documents = documents
        self.last_query = None

    def find(self, query):
        self.last_query = query
        return [document.copy() for document in self.documents]


class GetActivitiesTests(unittest.TestCase):
    def test_filters_activities_for_all_levels_when_difficulty_is_all(self):
        collection = FakeActivitiesCollection(
            [
                {"_id": "Chess Club", "description": "Open to everyone"},
            ]
        )

        with patch.object(activities, "activities_collection", collection):
            result = activities.get_activities(difficulty="all")

        self.assertEqual(collection.last_query, {"difficulty": {"$exists": False}})
        self.assertEqual(
            result,
            {"Chess Club": {"description": "Open to everyone"}},
        )

    def test_adds_specific_difficulty_to_query(self):
        collection = FakeActivitiesCollection([])

        with patch.object(activities, "activities_collection", collection):
            activities.get_activities(
                day="Tuesday",
                start_time="07:00",
                end_time="08:00",
                difficulty="Intermediate",
            )

        self.assertEqual(
            collection.last_query,
            {
                "schedule_details.days": {"$in": ["Tuesday"]},
                "schedule_details.start_time": {"$gte": "07:00"},
                "schedule_details.end_time": {"$lte": "08:00"},
                "difficulty": "intermediate",
            },
        )

    def test_rejects_unknown_difficulty_levels(self):
        with self.assertRaises(HTTPException) as context:
            activities.get_activities(difficulty="expert")

        self.assertEqual(context.exception.status_code, 400)
        self.assertEqual(context.exception.detail, "Invalid difficulty level")


if __name__ == "__main__":
    unittest.main()
