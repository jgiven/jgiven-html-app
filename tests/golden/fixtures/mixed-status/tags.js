jgivenReport.setTags({
    tagTypeMap: {
        "com.example.tags.Feature": {
            type: "com.example.tags.Feature",
            name: "Feature",
            description: "Feature area"
        },
        "com.example.tags.FeatureUi": {
            type: "com.example.tags.FeatureUi",
            name: "Feature",
            tags: ["com.example.tags.Feature"]
        },
        "com.example.tags.FeatureApi": {
            type: "com.example.tags.FeatureApi",
            name: "Feature",
            tags: ["com.example.tags.Feature"]
        },
        "com.example.tags.Issue": {
            type: "com.example.tags.Issue",
            name: "Issue",
            description: "Issue tracker"
        },
        "com.example.tags.Category": {
            type: "com.example.tags.Category",
            name: "Category"
        },
        "com.example.tags.SubCategory": {
            type: "com.example.tags.SubCategory",
            name: "SubCategory",
            tags: ["com.example.tags.Category"]
        }
    },
    tags: {
        "com.example.tags.Feature": { tagType: "com.example.tags.Feature" },
        "com.example.tags.Category": { tagType: "com.example.tags.Category" },
        "tag-feature-ui": { tagType: "com.example.tags.FeatureUi", value: "UI" },
        "tag-feature-api": { tagType: "com.example.tags.FeatureApi", value: "API" },
        "tag-issue-1": { tagType: "com.example.tags.Issue", value: "1" },
        "tag-issue-2": { tagType: "com.example.tags.Issue", value: "2" },
        "tag-sub-only": { tagType: "com.example.tags.SubCategory", value: "Only" }
    }
});
