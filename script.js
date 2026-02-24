let allJobs = [];
let jobStatus = [];

const loadJobs = () => {
    fetch('data.json')
        .then(res => res.json())
        .then(data => {
            allJobs = data;
            displayJobs(allJobs)
        })
}

document.addEventListener('click', function (e) {
    const interview = e.target.closest(".interview-btn")
    const reject = e.target.closest(".reject-btn")
    const tabBtn = e.target.closest(".tab-btn")

    // Change card status
    if (interview || reject) {
        const jobCard = e.target.closest('.job-card')
        const jobId = Number(jobCard.dataset.id)

        let existingJob = jobStatus.find(j => j.id === jobId)

        if (!existingJob) {
            const job = allJobs.find(j => j.id === jobId)
            jobStatus.push(job)
            existingJob = jobStatus.find(j => j.id === jobId)
        }

        existingJob.status = interview ? "Interview" :
            "Reject"

        UpdateCounts()
        displayCurrentTab()
    }

    // Tab btn change conditionally
    if (!tabBtn) return;
    if (tabBtn) {
        document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("btn-active"))
        tabBtn.classList.add("btn-active");

        displayCurrentTab();
    }

})

// Load data click on tab
function displayCurrentTab() {
    const activeTab = document.querySelector(".tab-btn.btn-active").innerText

    if (activeTab === "All") {
        displayJobs(allJobs)
    }
    if (activeTab === "Interview") {
        const interviewed = jobStatus.filter(j => j.status === 'Interview')
        displayJobs(interviewed)
    }
    if (activeTab === "Rejected") {
        const rejected = jobStatus.filter(j => j.status === 'Reject')
        displayJobs(rejected)
    }
}

// update count
function UpdateCounts() {
    const interviewed = jobStatus.filter(j => j.status === "Interview");
    const rejected = jobStatus.filter(j => j.status === "Reject");

    document.getElementById("interview-count").innerText = interviewed.length
    document.getElementById("reject-count").innerText = rejected.length

}
// Display all jobs data
const displayJobs = (jobs) => {
    const jobsContainer = document.getElementById("jobs-container")
    const noJobsCard = document.getElementById("no-jobs").classList;
    document.getElementById("total-jobs").innerText = allJobs.length
    jobsContainer.innerHTML = "";

    jobs.length !== 0 ?
        noJobsCard.add('hidden') :
        noJobsCard.remove('hidden')

    for (const job of jobs) {
        const jobsCard = document.createElement("div")

        const statusCheck = jobStatus.find(j => j.id === job.id)

        const statusText = statusCheck ? statusCheck.status :
            "NOT APPLIED"

        let statusClass = ""
        if (statusText === "Interview") {
            statusClass = "text-green-500 bg-green-100 border-l-3 font-bold"
        }

        if (statusText === "Reject") {
            statusClass = "text-red-500 bg-red-100 border-l-3 font-bold"
        }


        jobsCard.innerHTML = `
        <div data-id=${job.id} class="job-card space-y-3 shadow-sm p-8 rounded-md">
                    <div class="flex justify-between">
                        <div>
                            <h2 class="text-2xl font-semibold">${job.companyName}</h2>
                            <h4 class="text-lg opacity-65">${job.position}</h4>
                        </div>
                        <button class="btn btn-circle btn-error btn-outline hover:text-white">
                            <i class="fa-solid fa-trash text-lg"></i>
                        </button>
                    </div>
                    <ol class="list-disc list-inside inline">
                        <li>${job.location}</li>
                        <li>${job.type}</li>
                        <li>${job.salary}</li>
                    </ol>
                    <h3 class="px-4 py-2 mt-3 shadow-sm w-fit rounded-md change-status ${statusClass}">${statusText}</h3>
                    <p>${job.description}</p>
                    <div class="space-x-4">
                        <button class="btn btn-success btn-soft interview-btn shadow-sm">
                            Interview
                        </button>
                        <button class="btn btn-error btn-soft reject-btn shadow-sm">
                            Reject
                        </button>
                    </div>
                </div>
        `
        jobsContainer.append(jobsCard);
    }
}

loadJobs()