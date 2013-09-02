/**
 * Job Class with default values
 */

function job() {};

job.prototype.constructor = job;

job.prototype.print_list = [];
job.prototype.hot_folder = 'CMYK';
job.prototype.roll_number = 2;
job.prototype.template = 4090354;
job.prototype.errors = [];
job.prototype.sequence = 'assembly;matching;achtung';
job.prototype.id = null;
